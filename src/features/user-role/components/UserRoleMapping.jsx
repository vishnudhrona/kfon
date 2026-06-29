import { yupResolver } from "@hookform/resolvers/yup";
import { Accordion, AccordionItem, Box, Button, FormController, PermissionTable, SimpleGrid, useForm } from "@kfonbss/bss-ui-components";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { BsArrowLeftCircle, BsArrowRightCircle } from "@/components/custom";
import { errorToast } from '@/components/custom/Toast';
import { handleKeyDown } from "@/utils/validationUtils";

import { fetchAllRole, fetchRoleByUser as fetchRoleByUserAction, fetchSeatPermission, userMappingSubmit } from "../action";
import PermissionPreview from "../pop-up/PermissionPreview";
import { getAllRole, getRoleByUser, getSeatPermission } from "../selector";
import { userRoleMappingValidation } from "../validation";

const UserRoleMapping = ({ roleByUserData, getAllRoleData, fetchRoleLookup, fetchRoleByUser, fetchSeatPermission, seatPermissionData }) => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const routerState = useRouterState();
    const seatRow = routerState?.location?.state?.seatRow;

    const [permissions, setPermissions] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [payload, setPayload] = useState({});

    const sortedRoleData = useMemo(() => {
        return [...(getAllRoleData || [])].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }, [getAllRoleData]);

    const { control, handleSubmit, formState: { errors }, watch, reset } = useForm({
        resolver: yupResolver(userRoleMappingValidation(t)),
        mode: 'onChange',
        defaultValues: {
            seatName: '',
            role: []
        }
    });

    const selectedRole = watch("role");

    useEffect(() => {
        if (seatRow) {
            const preSelectedRoles = seatPermissionData?.roles && getAllRoleData?.length > 0
                ? getAllRoleData.filter((r) => seatPermissionData.roles[r.id])
                : [];
            reset({
                seatName: seatPermissionData?.seatName || seatRow.name || seatRow.seatName || '',
                role: preSelectedRoles
            });
        }
    }, [seatRow, reset, seatPermissionData, getAllRoleData]);

    useEffect(() => {
        fetchRoleLookup();
    }, [fetchRoleLookup, fetchSeatPermission]);

    useEffect(() => {
        if (seatRow?.id) {
            fetchSeatPermission({ seatId: seatRow?.id });
        }
    }, [seatRow, fetchSeatPermission]);

    useEffect(() => {
        if (selectedRole?.length > 0) {
            const roleIds = selectedRole.map((r) => r.id);
            fetchRoleByUser({ roleIds });
        }
    }, [selectedRole, fetchRoleByUser]);

    useEffect(() => {
        if (Array.isArray(roleByUserData?.data) && roleByUserData?.data.length > 0) {
            const allowedMenus = seatPermissionData?.menus ?? {};
            const allowedActions = seatPermissionData?.actions ?? {};
            const hasExistingPermissions = Object.keys(allowedMenus).length > 0 || Object.keys(allowedActions).length > 0;

            const formatData = (items) => {
                if (!Array.isArray(items)) return [];
                return items.map((item) => {
                    const menuId = item.id || item.sideMenuId;
                    const isMenuChecked = hasExistingPermissions ? !!allowedMenus[menuId] : (item.view || false);
                    const formattedActions = item.actions
                        ? item.actions.map((action) => {
                            const actionId = action.id || action.actionId;
                            const isActionChecked = hasExistingPermissions ? !!allowedActions[actionId] : (action.view || false);
                            return { ...action, view: isActionChecked };
                        })
                        : [];
                    return {
                        ...item,
                        view: isMenuChecked,
                        actions: formattedActions,
                        children: formatData(item.children || [])
                    };
                });
            };
            setPermissions(formatData(roleByUserData?.data));
        }
    }, [roleByUserData, seatPermissionData]);

    // Returns true if a section's children contain nested groups (3-level structure)
    const hasNestedChildren = (section) =>
        section?.children?.some((child) => child.children && child.children.length > 0);

    // ─── Section checkbox (3-level only) ────────────────────────────────────────
    const handleSectionCheckboxChange = useCallback((permissionIndex, sectionIndex) => {
        setPermissions((prevPermissions) => {
            const newPermissions = [...prevPermissions];
            const permission = { ...newPermissions[permissionIndex] };
            const children = [...(permission.children || [])];
            const section = { ...children[sectionIndex] };

            const allRows = (section.children || []).flatMap((group) => group.children || []);
            const isAllSelected = allRows.every((row) => row.view);
            const newStatus = !isAllSelected;

            section.children = (section.children || []).map((group) => ({
                ...group,
                view: newStatus,
                children: (group.children || []).map((row) => ({
                    ...row,
                    view: newStatus,
                    actions: row.actions ? row.actions.map((action) => ({ ...action, view: newStatus })) : []
                }))
            }));

            children[sectionIndex] = section;
            permission.children = children;
            newPermissions[permissionIndex] = permission;
            return newPermissions;
        });
    }, []);

    // Header checkbox: groupIdx provided for 3-level, undefined for 2-level
    const handleHeaderCheckboxChange = useCallback((permissionIndex, sectionIndex, groupIdx) => {
        setPermissions((prevPermissions) => {
            const newPermissions = [...prevPermissions];
            const permission = { ...newPermissions[permissionIndex] };
            const children = [...(permission.children || [])];
            const section = { ...children[sectionIndex] };

            const isThreeLevel = hasNestedChildren(section);

            if (isThreeLevel && groupIdx !== undefined) {
                // Toggle only the specific group's children
                const sectionChildren = [...(section.children || [])];
                const group = { ...sectionChildren[groupIdx] };
                const groupChildren = group.children || [];

                const isAllSelected = groupChildren.every((item) => item.view);
                const newStatus = !isAllSelected;

                group.children = groupChildren.map((item) => ({
                    ...item,
                    view: newStatus,
                    actions: item.actions ? item.actions.map((action) => ({ ...action, view: newStatus })) : []
                }));

                sectionChildren[groupIdx] = group;
                section.children = sectionChildren;
            } else {
                // 2-level: toggle all rows in section
                const isAllSelected = section.children?.every((item) => item.view);
                const newStatus = !isAllSelected;

                if (section.children) {
                    section.children = section.children.map((item) => ({
                        ...item,
                        view: newStatus,
                        actions: item.actions ? item.actions.map((action) => ({ ...action, view: newStatus })) : []
                    }));
                }
            }

            children[sectionIndex] = section;
            permission.children = children;
            newPermissions[permissionIndex] = permission;
            return newPermissions;
        });
    }, []);

    // Row checkbox: groupIdx & rowIndex from group.children for 3-level
    const handleRowCheckboxChange = useCallback((permissionIndex, sectionIndex, rowIndex, groupIdx) => {
        setPermissions((prevPermissions) => {
            const newPermissions = [...prevPermissions];
            const permission = { ...newPermissions[permissionIndex] };
            const children = [...(permission.children || [])];
            const section = { ...children[sectionIndex] };

            const isThreeLevel = hasNestedChildren(section);

            if (isThreeLevel && groupIdx !== undefined) {
                const sectionChildren = [...(section.children || [])];
                const group = { ...sectionChildren[groupIdx] };
                const groupChildren = [...(group.children || [])];

                const newStatus = !groupChildren[rowIndex].view;
                groupChildren[rowIndex] = {
                    ...groupChildren[rowIndex],
                    view: newStatus,
                    actions: groupChildren[rowIndex].actions
                        ? groupChildren[rowIndex].actions.map((action) => ({ ...action, view: newStatus }))
                        : []
                };

                group.children = groupChildren;
                sectionChildren[groupIdx] = group;
                section.children = sectionChildren;
            } else {
                // 2-level
                if (section.children) {
                    const updatedChildren = [...section.children];
                    const newStatus = !updatedChildren[rowIndex].view;
                    updatedChildren[rowIndex] = {
                        ...updatedChildren[rowIndex],
                        view: newStatus,
                        actions: updatedChildren[rowIndex].actions
                            ? updatedChildren[rowIndex].actions.map((action) => ({ ...action, view: newStatus }))
                            : []
                    };
                    section.children = updatedChildren;
                }
            }

            children[sectionIndex] = section;
            permission.children = children;
            newPermissions[permissionIndex] = permission;
            return newPermissions;
        });
    }, []);

    // Action checkbox: groupIdx needed to locate the row in the correct group
    const handleActionCheckboxChange = useCallback((permissionIndex, sectionIndex, rowIndex, actionIndex, groupIdx) => {
        setPermissions((prevPermissions) => {
            const newPermissions = [...prevPermissions];
            const permission = { ...newPermissions[permissionIndex] };
            const children = [...(permission.children || [])];
            const section = { ...children[sectionIndex] };

            const isThreeLevel = hasNestedChildren(section);

            if (isThreeLevel && groupIdx !== undefined) {
                const sectionChildren = [...(section.children || [])];
                const group = { ...sectionChildren[groupIdx] };
                const groupChildren = [...(group.children || [])];
                const updatedRow = { ...groupChildren[rowIndex] };

                if (updatedRow.actions) {
                    const updatedActions = [...updatedRow.actions];
                    updatedActions[actionIndex] = { ...updatedActions[actionIndex], view: !updatedActions[actionIndex].view };
                    updatedRow.actions = updatedActions;
                    updatedRow.view = updatedActions.some((action) => action.view);
                }

                groupChildren[rowIndex] = updatedRow;
                group.children = groupChildren;
                sectionChildren[groupIdx] = group;
                section.children = sectionChildren;
            } else {
                // 2-level
                if (section.children) {
                    const updatedChildren = [...section.children];
                    const updatedRow = { ...updatedChildren[rowIndex] };

                    if (updatedRow.actions) {
                        const updatedActions = [...updatedRow.actions];
                        updatedActions[actionIndex] = { ...updatedActions[actionIndex], view: !updatedActions[actionIndex].view };
                        updatedRow.actions = updatedActions;

                        if (updatedActions.some((action) => action.view)) {
                            updatedRow.view = true;
                        }
                    }

                    updatedChildren[rowIndex] = updatedRow;
                    section.children = updatedChildren;
                }
            }

            children[sectionIndex] = section;
            permission.children = children;
            newPermissions[permissionIndex] = permission;
            return newPermissions;
        });
    }, []);

    const accordionCheckboxChange = useCallback((index, checked) => {
        setPermissions((prevPermissions) => {
            const newPermissions = [...prevPermissions];
            newPermissions[index] = {
                ...newPermissions[index],
                view: checked,
                children: toggleRecursively(newPermissions[index].children || [], checked)
            };
            return newPermissions;
        });
    }, []);

    const getPermissionStatus = (permissionIndex) => {
        const permission = permissions[permissionIndex];
        if (!permission || !permission.children) return false;

        const sections = permission.children;
        let allRowsChecked = true;
        let anyRowChecked = false;
        let hasRows = false;
        let hasActions = false;
        let allActionsChecked = true;
        let anyActionChecked = false;

        for (const section of sections) {
            // 3-level: section → group → row
            if (section.children && section.children.some((c) => c.children && c.children.length > 0)) {
                for (const group of section.children) {
                    for (const row of (group.children || [])) {
                        hasRows = true;
                        if (!row.view) allRowsChecked = false;
                        if (row.view) anyRowChecked = true;

                        if (row.actions && row.actions.length > 0) {
                            hasActions = true;
                            if (!row.actions.every((a) => a.view)) allActionsChecked = false;
                            if (row.actions.some((a) => a.view)) anyActionChecked = true;
                        }
                    }
                }
            } else if (section.children && section.children.length > 0) {
                // 2-level: section → row
                hasRows = true;
                for (const row of section.children) {
                    if (!row.view) allRowsChecked = false;
                    if (row.view) anyRowChecked = true;

                    if (row.actions && row.actions.length > 0) {
                        hasActions = true;
                        if (!row.actions.every((action) => action.view)) allActionsChecked = false;
                        if (row.actions.some((action) => action.view)) anyActionChecked = true;
                    }
                }
            } else {
                if (!section.view) allRowsChecked = false;
                if (section.view) anyRowChecked = true;
            }
        }

        if (hasRows) {
            if (allRowsChecked && (hasActions ? allActionsChecked : true)) return true;
            if (anyRowChecked || anyActionChecked) return 'indeterminate';
            return false;
        }

        return false;
    };

    const onSubmit = (data) => {
        const moduleRequests = [];
        const menus = {};
        const actions = {};

        const selectedMenus = permissions.reduce((acc, permission) => {
            (permission.children || []).forEach((section) => {
                const isThreeLevel = (section.children || []).some(child => (child.children?.length ?? 0) > 0);

                const processItem = (item, parentSection) => {
                    if (item.view || (item.actions && item.actions.some((action) => action.view))) {
                        const selectedActions = item.actions ? item.actions.filter((action) => action.view) : [];

                        if (item.view) {
                            const menuId = item.id || item.sideMenuId;
                            if (menuId) {
                                menus[menuId] = menuId;
                                moduleRequests.push({
                                    sideMenuId: menuId,
                                    active: true
                                });
                            }
                        }

                        selectedActions.forEach((action) => {
                            const actionId = action.id || action.actionId;
                            if (actionId) {
                                actions[actionId] = actionId;
                            }
                        });

                        acc.push({
                            ...item,
                            actions: selectedActions,
                            parentSection: parentSection,
                            permissionCategory: permission.name
                        });
                    }
                };

                if (isThreeLevel) {
                    // Nested: section → group → item
                    (section.children || []).forEach((group) => {
                        (group.children || []).forEach((item) => processItem(item, group.name || section.name));
                    });
                } else {
                    // Flat: section → item
                    (section.children || []).forEach((item) => processItem(item, section.name));
                }
            });
            return acc;
        }, []);

        if (selectedMenus?.length === 0) {
            errorToast({ description: t('pleaseSelectAtLeastOnePermission') });
            return;
        }

        const currentRoles = data.role?.reduce((acc, r) => { acc[r.id] = r.id; return acc; }, {}) || {};

        const areKeysEqual = (obj1, obj2) => {
            const keys1 = Object.keys(obj1 || {}).sort();
            const keys2 = Object.keys(obj2 || {}).sort();
            return keys1.length === keys2.length && keys1.every((key, index) => key === keys2[index]);
        };

        const isSameName = (seatPermissionData?.seatName || seatRow?.name || seatRow?.seatName || '') === data.seatName;
        const isSameRoles = areKeysEqual(seatPermissionData?.roles, currentRoles);
        const isSameMenus = areKeysEqual(seatPermissionData?.menus, menus);
        const isSameActions = areKeysEqual(seatPermissionData?.actions, actions);

        if (seatRow?.id && isSameName && isSameRoles && isSameMenus && isSameActions) {
            errorToast({ description: t('noChangesHaveBeenMadeToThePermissions') });
            return;
        }

        const newPayload = {
            seatName: data.seatName,
            seatId: seatRow?.id,
            roles: data.role?.reduce((acc, r) => { acc[r.id] = r.id; return acc; }, {}),
            menus,
            actions,
            onSuccess: () => {
                setShowPreview(false);
                navigate({ to: '/app/users/seat-list' });
            }
        };

        setSelectedRows({ permissions: selectedMenus });
        setPayload(newPayload);
        setShowPreview(true);
    };

    return (
        <>
            <Box as={'form'} display={'flex'} flexDirection={'column'} height={'100%'} overflow={'hidden'} gap={5} px={5} py={4} onSubmit={handleSubmit(onSubmit)}>
                <SimpleGrid columns={'3'} gap={'80px'} alignItems={'center'} pb={5}>
                    <FormController
                        placeholder={t('enter', { 0: t('seatName') })}
                        labelName={t('seatName')}
                        name='seatName'
                        control={control}
                        errors={errors}
                        onKeyDown={handleKeyDown}
                        disabled
                        required
                    />

                    <FormController
                        placeholder={t('choose', { 0: t('role') })}
                        labelName={t('role')}
                        name='role'
                        control={control}
                        errors={errors}
                        type='select'
                        isMulti
                        items={sortedRoleData}
                        required
                    />
                </SimpleGrid>

                {selectedRole?.length > 0 && (
                    <Box flex={1} overflowY={'auto'}>
                        <Accordion>
                            {permissions?.map((permission, permissionIndx) => (
                                <PermissionGroup
                                    key={permissionIndx}
                                    permission={permission}
                                    index={permissionIndx}
                                    isChecked={getPermissionStatus(permissionIndx)}
                                    onAccordionChange={accordionCheckboxChange}
                                    onSectionChange={handleSectionCheckboxChange}
                                    onHeaderChange={handleHeaderCheckboxChange}
                                    onRowChange={handleRowCheckboxChange}
                                    onActionChange={handleActionCheckboxChange}
                                    t={t}
                                />
                            ))}
                        </Accordion>
                    </Box>
                )}

                <Box bg='white' display='flex' gap={2} justifyContent='flex-end'>
                    <Button type='button' variant='outline' onClick={() => navigate({ to: '/app/users/seat-list' })}    >
                        <BsArrowLeftCircle />
                        {t('back')}
                    </Button>
                    <Button type='submit'>
                        {t('next')}
                        <BsArrowRightCircle />
                    </Button>
                </Box>
            </Box>

            {showPreview && (
                <PermissionPreview
                    showPreview={showPreview}
                    setShowPreview={setShowPreview}
                    selectedRows={selectedRows}
                    payload={payload}
                    isEditMode={false}
                    fetchAction={true}
                    preSetRole={seatPermissionData}

                />
            )}
        </>
    );
};

const toggleRecursively = (items, status) => {
    return items.map((item) => ({
        ...item,
        view: status,
        actions: item.actions ? item.actions.map((action) => ({ ...action, view: status })) : [],
        children: item.children ? toggleRecursively(item.children, status) : []
    }));
};

const PermissionGroup = memo(({
    permission,
    index,
    isChecked,
    onAccordionChange,
    onSectionChange,
    onHeaderChange,
    onRowChange,
    onActionChange,
    t
}) => {
    const selectedCount = permission?.children?.reduce((acc, section) => {
        // 3-level: count items inside nested groups
        if (section.children?.some((c) => c.children && c.children.length > 0)) {
            return acc + section.children.reduce((groupAcc, group) => {
                return groupAcc + (group.children?.filter((item) => item.view).length || 0);
            }, 0);
        }
        // 2-level
        if (section.children) {
            return acc + section.children.filter((item) => item.view).length;
        }
        return acc + (section.view ? 1 : 0);
    }, 0) || 0;

    return (
        <AccordionItem
            title={t(permission?.name)}
            value={index}
            gridRemove={true}
            checkbox={true}
            checked={isChecked}
            selectedCount={selectedCount}
            onCheckboxChange={(e) => onAccordionChange(index, e)}
        >
            <Box px={8} overflow={'scroll'} maxHeight={'500px'}>
                <PermissionTable
                    permissionData={permission?.children}
                    emptyMessage="No permissions found"
                    onSectionCheckboxChange={(sectionIndex) => onSectionChange(index, sectionIndex)}
                    onHeaderCheckboxChange={(sectionIndex, groupIdx) => onHeaderChange(index, sectionIndex, groupIdx)}
                    onRowCheckboxChange={(sectionIndex, rowIndex, groupIdx) => onRowChange(index, sectionIndex, rowIndex, groupIdx)}
                    onActionCheckboxChange={(sectionIndex, rowIndex, actionIndex, groupIdx) =>
                        onActionChange(index, sectionIndex, rowIndex, actionIndex, groupIdx)
                    }
                />
            </Box>
        </AccordionItem>
    );
});

const mapStateToProps = (state) => ({
    roleByUserData: getRoleByUser(state),
    getAllRoleData: getAllRole(state),
    seatPermissionData: getSeatPermission(state)
});

const mapDispatchToProps = {
    fetchRoleLookup: fetchAllRole,
    fetchRoleByUser: fetchRoleByUserAction,
    submitUserMapping: userMappingSubmit,
    fetchSeatPermission: fetchSeatPermission
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRoleMapping);