import { yupResolver } from '@hookform/resolvers/yup';
import { Box, HStack, Popup, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { validation } from '@/utils/validationUtils';

import { createNote, fetchAllRoles, fetchFileViewUrl, fetchNotes, fetchUsersByRoleId, forwardNote } from '../actions';
import { NOTE_STATUS } from '../constants';
import { getAllRoles, getFileViewUrl, getNotesList, getUsersByRoleId } from '../selectors';
import { actions as sliceActions } from '../slice';
import FilePreviewPanel from './FilePreviewPanel';
import ForwardPanel from './ForwardPanel';
import NoteInput from './NoteInput';
import NotesActionButtons from './NotesActionButtons';
import NotesList from './NotesList';

const getRemarkSchema = (t) =>
  Yup.object().shape({
    remark: Yup.string()
      .trim()
      .required(t('required', { 0: t('remark') }))
  });

/**
 * Reusable NotesModal for any feature.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: function
 *  - moduleId: string (uuid) — the record ID this note belongs to
 *  - moduleName: string — e.g. 'INVENTORY', 'SUBSCRIBER'
 *  - subModule: string — e.g. 'OEM', 'TICKET'
 *  - headerContent: ReactNode — optional content to render above the notes list (e.g. DeviceDetailCard)
 */
const NotesModal = ({ isOpen, onClose, moduleId, moduleName, subModule, headerContent }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { pleaseSelect } = validation(t);

  const notes = useSelector(getNotesList);
  const fileViewData = useSelector(getFileViewUrl);
  const roles = useSelector(getAllRoles) || [];
  const roleUsers = useSelector(getUsersByRoleId) || [];

  const [isForwardOpen, setIsForwardOpen] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreviewUrl, setAttachmentPreviewUrl] = useState(null);
  const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);

  const [forwardSelectedUserId, setForwardSelectedUserId] = useState('');
  const [forwardUserError, setForwardUserError] = useState('');
  const [forwardUserSearch, setForwardUserSearch] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(getRemarkSchema(t)) });

  const {
    control: forwardControl,
    watch: forwardWatch,
    reset: forwardReset
  } = useForm({ defaultValues: { roleId: '' } });

  const currentRemark = watch('remark');
  const watchedRole = forwardWatch('roleId');
  const watchedRoleId = watchedRole?.id ?? watchedRole;

  useEffect(() => {
    if (isOpen && moduleId) {
      dispatch(fetchNotes({ moduleId }));
    }
  }, [isOpen, moduleId, dispatch]);

  useEffect(() => {
    if (!isOpen) {
      dispatch(sliceActions.clearFileViewUrl());
      setSelectedFileId(null);
      setIsForwardOpen(false);
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (isForwardOpen) {
      dispatch(fetchAllRoles());
    }
  }, [isForwardOpen, dispatch]);

  useEffect(() => {
    if (watchedRoleId) {
      setForwardSelectedUserId('');
      dispatch(fetchUsersByRoleId({ roleId: watchedRoleId }));
    }
  }, [watchedRoleId, dispatch]);

  const resetForm = () => {
    reset();
    forwardReset();
    setAttachment(null);
    if (attachmentPreviewUrl) URL.revokeObjectURL(attachmentPreviewUrl);
    setAttachmentPreviewUrl(null);
    setShowAttachmentPreview(false);
    setSelectedFileId(null);
    setIsForwardOpen(false);
    setForwardSelectedUserId('');
    setForwardUserError('');
    setForwardUserSearch('');
    dispatch(sliceActions.clearFileViewUrl());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleRemarkSubmit = (data) => {
    dispatch(
      createNote({
        moduleId,
        moduleName,
        subModule,
        note: data.remark,
        status: NOTE_STATUS.OPEN,
        visibility: 'INTERNAL',
        attachment,
        onSuccess: () => {
          reset();
          setAttachment(null);
          if (attachmentPreviewUrl) URL.revokeObjectURL(attachmentPreviewUrl);
          setAttachmentPreviewUrl(null);
          setShowAttachmentPreview(false);
          dispatch(fetchNotes({ moduleId }));
        }
      })
    );
  };

  const handleDocumentClick = (fileId) => {
    setSelectedFileId(fileId);
    setShowAttachmentPreview(false);
    dispatch(fetchFileViewUrl({ fileId }));
  };

  const handleAttachmentPreviewClick = (file, previewUrl) => {
    if (file === null) {
      // toggling preview of already-set attachment
      setSelectedFileId(null);
      setShowAttachmentPreview(true);
      return;
    }
    if (attachmentPreviewUrl) URL.revokeObjectURL(attachmentPreviewUrl);
    setAttachment(file);
    setAttachmentPreviewUrl(previewUrl);
    setShowAttachmentPreview(false);
  };

  const handleRemoveAttachment = () => {
    if (attachmentPreviewUrl) URL.revokeObjectURL(attachmentPreviewUrl);
    setAttachment(null);
    setAttachmentPreviewUrl(null);
    setShowAttachmentPreview(false);
  };

  const handleForwardOpen = handleSubmit(() => {
    setSelectedFileId(null);
    setShowAttachmentPreview(false);
    dispatch(sliceActions.clearFileViewUrl());
    setIsForwardOpen(true);
  });

  const handleForwardCancel = () => {
    setIsForwardOpen(false);
    forwardReset();
    setForwardSelectedUserId('');
    setForwardUserError('');
    setForwardUserSearch('');
  };

  const handleForwardSubmit = () => {
    if (!forwardSelectedUserId) {
      setForwardUserError(pleaseSelect('user'));
      return;
    }
    setForwardUserError('');
    dispatch(
      forwardNote({
        moduleId,
        moduleName,
        subModule,
        note: currentRemark,
        forwardedUserId: forwardSelectedUserId,
        status: NOTE_STATUS.FORWARDED,
        visibility: 'INTERNAL',
        attachment,
        onSuccess: handleClose
      })
    );
  };

  const showRightPanel = selectedFileId || isForwardOpen || showAttachmentPreview;
  console.log('rendering NotesModal', { notes });
  return (
    <Popup
      isOpen={isOpen}
      onOpenChange={(e) => {
        if (!e.open) handleClose();
      }}
      title={t('send')}
      titleMain={t('notes')}
      closeButton={false}
      initialFocusEl={null}
      size='xl'
      borderRadius='12px'
    >
      <Box px={3} pb={3} pt={2}>
        {headerContent}

        <HStack align='stretch' spacing={2} mb={4} h='381px'>
          {/* Left: notes list + input */}
          <Box
            bg='rgba(241,241,241,0.55)'
            borderRadius='12px'
            p='3'
            w={showRightPanel ? '50%' : '100%'}
            flexShrink={0}
            overflow='hidden'
            transition='width 0.2s'
          >
            <VStack align='stretch' spacing={2} h='100%'>
              <Box bg='white' borderRadius='8px' overflowY='auto' flex={1} minH={0}>
                <NotesList notes={notes} onDocumentClick={handleDocumentClick} />
              </Box>

              <NoteInput
                control={control}
                errors={errors}
                handleSubmit={handleSubmit}
                onSubmit={handleRemarkSubmit}
                attachment={attachment}
                attachmentPreviewUrl={attachmentPreviewUrl}
                onAttachmentPreviewClick={handleAttachmentPreviewClick}
                onRemoveAttachment={handleRemoveAttachment}
              />
            </VStack>
          </Box>

          {/* Right: document / attachment preview */}
          {(selectedFileId || showAttachmentPreview) && !isForwardOpen && (
            <FilePreviewPanel
              showAttachmentPreview={showAttachmentPreview}
              attachment={attachment}
              attachmentPreviewUrl={attachmentPreviewUrl}
              fileViewData={fileViewData}
              onClose={() => {
                setSelectedFileId(null);
                setShowAttachmentPreview(false);
              }}
            />
          )}

          {/* Right: forward / role-user panel */}
          {isForwardOpen && (
            <ForwardPanel
              forwardControl={forwardControl}
              roles={roles}
              roleUsers={roleUsers}
              forwardUserSearch={forwardUserSearch}
              onForwardUserSearchChange={setForwardUserSearch}
              forwardSelectedUserId={forwardSelectedUserId}
              onForwardUserSelect={setForwardSelectedUserId}
              forwardUserError={forwardUserError}
              watchedRoleId={watchedRoleId}
            />
          )}
        </HStack>

        <NotesActionButtons
          onClose={isForwardOpen ? handleForwardCancel : handleClose}
          onSubmit={isForwardOpen ? handleForwardSubmit : handleForwardOpen}
          submitLabel={isForwardOpen ? 'done' : 'forward'}
          closeLabel={isForwardOpen ? 'cancel' : 'close'}
          mt={5}
        />
      </Box>
    </Popup>
  );
};

export default NotesModal;
