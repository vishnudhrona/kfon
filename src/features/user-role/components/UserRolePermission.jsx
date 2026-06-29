import { yupResolver } from "@hookform/resolvers/yup";
import { Accordion, AccordionItem, Box, Button, FormController, PermissionTable, SimpleGrid, useForm } from "@kfonbss/bss-ui-components";
import { useNavigate } from "@tanstack/react-router";
import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { BsArrowLeftCircle, BsArrowRightCircle } from "@/components/custom";
import { errorToast } from '@/components/custom/Toast';
import { handleKeyDown } from "@/utils/validationUtils";

import { fetchRoleCreationMenu } from "../action";
import PermissionPreview from "../pop-up/PermissionPreview";
import { getEditUserPermissionData, getUserRoleDetails } from "../selector";
import { userRolePermissionValidation } from "../validation";

const UserRolePermission = ({ getUserRoleData, getUserRole, getEditUserPermissionData }) => {

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [permissions, setPermissions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [payload, setPayload] = useState({});

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(userRolePermissionValidation(t)),
    mode: 'onChange',
    defaultValues: {
      roleName: '',
      description: ''
    }
  });

  useEffect(() => {
    if (getEditUserPermissionData) {
      reset({
        roleName: getEditUserPermissionData.roleName || '',
        description: getEditUserPermissionData.description || ''
      });
    }
  }, [getEditUserPermissionData, reset]);

  useEffect(() => {
    getUserRole();
  }, [getUserRole]);

  useEffect(() => {
    if (getUserRoleData?.data) {
      const editMenus = getEditUserPermissionData?.menus ? Object.values(getEditUserPermissionData.menus) : [];
      const editActions = getEditUserPermissionData?.actions ? Object.values(getEditUserPermissionData.actions) : [];

      const formatData = (items) => {
        if (!Array.isArray(items)) return [];
        return items.map((item) => {
          const isMenuViewed = !!item.view || editMenus.includes(item.id || item.sideMenuId);
          return {
            ...item,
            view: isMenuViewed,
            actions: item.actions
              ? item.actions.map((action) => ({ ...action, view: action.view || editActions.includes(action.id || action.actionId) }))
              : [],
            children: formatData(item.children || [])
          };
        });
      };
      setPermissions(formatData(getUserRoleData.data));
    }
  }, [getUserRoleData, getEditUserPermissionData]);

  // Checks if a section has 3-level nesting
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

  // ─── Header checkbox ─────────────────────────────────────────────────────────
  // 3-level: groupIdx provided → toggle that subMenu group's rows only
  // 2-level: groupIdx undefined → toggle all rows in the section
  const handleHeaderCheckboxChange = useCallback((permissionIndex, sectionIndex, groupIdx) => {
    setPermissions((prevPermissions) => {
      const newPermissions = [...prevPermissions];
      const permission = { ...newPermissions[permissionIndex] };
      const children = [...(permission.children || [])];
      const section = { ...children[sectionIndex] };

      const isThreeLevel = hasNestedChildren(section);

      if (isThreeLevel && groupIdx !== undefined) {
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

  // ─── Row checkbox ─────────────────────────────────────────────────────────────
  // 3-level: groupIdx provided → find row inside that group
  // 2-level: groupIdx undefined → row is direct child of section
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

        const currentStatus = groupChildren[rowIndex].view;
        const newStatus = !currentStatus;

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
        if (section.children) {
          const updatedChildren = [...section.children];
          const currentStatus = updatedChildren[rowIndex].view;
          const newStatus = !currentStatus;

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

  // ─── Action checkbox ──────────────────────────────────────────────────────────
  // 3-level: groupIdx provided → find row inside that group, toggle action
  // 2-level: groupIdx undefined → find row directly in section
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
          updatedRow.view = true
        }

        groupChildren[rowIndex] = updatedRow;
        group.children = groupChildren;
        sectionChildren[groupIdx] = group;
        section.children = sectionChildren;
      } else {
        if (section.children) {
          const updatedChildren = [...section.children];
          const updatedRow = { ...updatedChildren[rowIndex] };

          if (updatedRow.actions) {
            const updatedActions = [...updatedRow.actions];
            updatedActions[actionIndex] = { ...updatedActions[actionIndex], view: !updatedActions[actionIndex].view };
            updatedRow.actions = updatedActions;
            updatedRow.view = true
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

    let allRowsChecked = true;
    let anyRowChecked = false;
    let hasRows = false;
    let hasActions = false;
    let allActionsChecked = true;
    let anyActionChecked = false;

    for (const section of permission.children) {
      // 3-level
      if (section.children?.some((c) => c.children && c.children.length > 0)) {
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
        // 2-level
        hasRows = true;
        for (const row of section.children) {
          if (!row.view) allRowsChecked = false;
          if (row.view) anyRowChecked = true;

          if (row.actions && row.actions.length > 0) {
            hasActions = true;
            if (!row.actions.every((a) => a.view)) allActionsChecked = false;
            if (row.actions.some((a) => a.view)) anyActionChecked = true;
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
    let menuIndex = 1;
    let actionIndex = 1;

    const selectedMenus = permissions.reduce((acc, permission) => {
      (permission.children || []).forEach((section) => {
        const isThreeLevel = hasNestedChildren(section);

        if (isThreeLevel) {
          (section.children || []).forEach((group) => {
            (group.children || []).forEach((item) => {
              if (item.view || (item.actions && item.actions.some((action) => action.view))) {
                const selectedActions = item.actions ? item.actions.filter((action) => action.view) : [];

                if (item.view) {
                  const menuId = item.id || item.sideMenuId;
                  if (menuId) {
                    menus[`additionalProp${menuIndex++}`] = menuId;
                    moduleRequests.push({ sideMenuId: menuId, active: true });
                  }
                }

                selectedActions.forEach((action) => {
                  const actionId = action.id || action.actionId;
                  if (actionId) {
                    actions[`additionalProp${actionIndex++}`] = actionId;
                  }
                });

                acc.push({
                  ...item,
                  actions: selectedActions,
                  parentSection: group.name,
                  permissionCategory: permission.name
                });
              }
            });
          });
        } else {
          (section.children || []).forEach((item) => {
            if (item.view || (item.actions && item.actions.some((action) => action.view))) {
              const selectedActions = item.actions ? item.actions.filter((action) => action.view) : [];

              if (item.view) {
                const menuId = item.id || item.sideMenuId;
                if (menuId) {
                  menus[`additionalProp${menuIndex++}`] = menuId;
                  moduleRequests.push({ sideMenuId: menuId, active: true });
                }
              }

              selectedActions.forEach((action) => {
                const actionId = action.id || action.actionId;
                if (actionId) {
                  actions[`additionalProp${actionIndex++}`] = actionId;
                }
              });

              acc.push({
                ...item,
                actions: selectedActions,
                parentSection: section.name,
                permissionCategory: permission.name
              });
            }
          });
        }
      });
      return acc;
    }, []);

    if (selectedMenus?.length === 0) {
      errorToast({ description: t('pleaseSelectAtLeastOnePermission') });
      return;
    }

    const payload = {
      ...(getEditUserPermissionData?.id ? { id: getEditUserPermissionData.id } : {}),
      roleName: data.roleName,
      description: data.description,
      active: true,
      menus,
      actions
    };

    setSelectedRows({ permissions: selectedMenus });
    setPayload(payload);
    setShowPreview(true);
  };

  return (
    <>
      <Box as={'form'} display={'flex'} flexDirection={'column'} height={'100%'} overflow={'hidden'} gap={5} px={5} py={4} onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={'3'} gap={'80px'} alignItems={'center'} pb={5}>
          <FormController
            placeholder={t('enter', { 0: t('roleName') })}
            labelName={t('roleName')}
            name='roleName'
            control={control}
            errors={errors}
            onKeyDown={handleKeyDown}
            minLength={3}
            maxLength={100}
            required
          />
          <FormController
            placeholder={t('enter', { 0: t('description') })}
            labelName={t('description')}
            name='description'
            control={control}
            errors={errors}
            minLength={3}
            maxLength={250}
            required
          />
        </SimpleGrid>

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

        <Box bg='white' display='flex' gap={2} justifyContent='flex-end'>
          <Button variant='outline' onClick={() => navigate({ to: '/app/users/roles' })}>
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
          isEditMode={!!getEditUserPermissionData}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  getUserRoleData: getUserRoleDetails(state),
  getEditUserPermissionData: getEditUserPermissionData(state)
});

const mapDispatchToProps = {
  getUserRole: fetchRoleCreationMenu
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRolePermission);

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
    // 3-level: count through subMenu groups
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