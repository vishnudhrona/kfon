import { Box } from '@kfonbss/bss-ui-components';
import { useEffect, useRef, useState } from 'react';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';

const GroupedPackageSelect = ({ value = [], onChange, groups = [], placeholder = 'Choose...', isDisabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({});
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleGroup = (srvId, e) => {
        e.stopPropagation();
        setExpandedGroups(prev => ({ ...prev, [srvId]: !prev[srvId] }));
    };

    const togglePackage = (srvId, pkgId, e) => {
        e.stopPropagation();
        const arr = Array.isArray(value) ? value : [];
        const existing = arr.find(s => String(s.serviceId) === String(srvId));
        if (existing) {
            const hasPkg = existing.planIds.map(String).includes(String(pkgId));
            const newPlanIds = hasPkg
                ? existing.planIds.filter(id => String(id) !== String(pkgId))
                : [...existing.planIds, pkgId];
            onChange(newPlanIds.length === 0
                ? arr.filter(s => String(s.serviceId) !== String(srvId))
                : arr.map(s => String(s.serviceId) === String(srvId) ? { ...s, planIds: newPlanIds } : s)
            );
        } else {
            onChange([...arr, { serviceId: srvId, planIds: [pkgId] }]);
        }
    };

    const isPackageChecked = (srvId, pkgId) => {
        const arr = Array.isArray(value) ? value : [];
        return arr.find(s => String(s.serviceId) === String(srvId))?.planIds?.map(String).includes(String(pkgId)) ?? false;
    };

    const selectedLabel = Array.isArray(value) && value.length > 0
        ? value
            .map(s => {
                const group = groups.find(g => String(g.srvId) === String(s.serviceId));
                const name = group?.serviceName ?? s.serviceId;
                const count = s.planIds?.length ?? 0;
                return `${name} (${count} Package${count !== 1 ? 's' : ''})`;
            })
            .join(', ')
        : null;

    return (
        <Box ref={ref} position="relative">
            <Box
                border="1px solid"
                borderColor="#A0A0A0"
                borderRadius="6px"
                h="48px"
                display="flex"
                alignItems="center"
                px={3}
                cursor={isDisabled ? 'not-allowed' : 'pointer'}
                opacity={isDisabled ? 0.6 : 1}
                onClick={() => !isDisabled && setIsOpen(o => !o)}
                justifyContent="space-between"
                bg="white"
            >
                <Box color={selectedLabel ? '#272727' : '#A0A0A0'} fontSize="14px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" flex={1} mr={2}>
                    {selectedLabel ?? placeholder}
                </Box>
                <Box color="#A0A0A0">
                    {isOpen ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
                </Box>
            </Box>
            {isOpen && (
                <Box
                    position="absolute"
                    top="calc(100% + 4px)"
                    left="0"
                    right="0"
                    bg="white"
                    boxShadow="0px 4px 12px rgba(0,0,0,0.15)"
                    borderRadius="8px"
                    zIndex="9999"
                    maxH="300px"
                    overflowY="auto"
                    border="1px solid"
                    borderColor="gray.100"
                >
                    {groups.length === 0 ? (
                        <Box px={4} py={3} color="gray.400" fontSize="14px">No options available</Box>
                    ) : (
                        groups.map(group => (
                            <Box key={group.srvId} borderBottom="1px solid" borderColor="gray.100">
                                <Box
                                    px={4}
                                    py={3}
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    cursor="pointer"
                                    fontWeight="500"
                                    fontSize="14px"
                                    color="#232F50"
                                    _hover={{ bg: '#f9f9f9' }}
                                    onClick={(e) => toggleGroup(group.srvId, e)}
                                >
                                    {group.serviceName}
                                    {expandedGroups[group.srvId] ? <LuChevronUp size={14} /> : <LuChevronDown size={14} />}
                                </Box>
                                {expandedGroups[group.srvId] && (
                                    <Box bg="#FAFAFA">
                                        {(group.packages || []).map(pkg => {
                                            const isChecked = isPackageChecked(group.srvId, pkg.id);
                                            return (
                                                <Box
                                                    key={pkg.id}
                                                    px={6}
                                                    py={2}
                                                    display="flex"
                                                    alignItems="center"
                                                    gap="10px"
                                                    cursor="pointer"
                                                    _hover={{ bg: '#f0f0f0' }}
                                                    borderBottom="1px solid"
                                                    borderColor="gray.50"
                                                    onClick={(e) => togglePackage(group.srvId, pkg.id, e)}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => { }}
                                                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#8D0247' }}
                                                    />
                                                    <Box fontSize="14px" color="#272727">{pkg.packageName}</Box>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                )}
                            </Box>
                        ))
                    )}
                </Box>
            )}
        </Box>
    );
};

export default GroupedPackageSelect;
