import { Modal } from 'antd';
import type { User } from '@/types/admin.types';

interface DeleteUserModalProps {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: (record: User | null) => void,
  record: User | null,
}

const DeleteUserModal = ({ isOpen, onClose, onConfirm, record }: DeleteUserModalProps) => {

  return (
    <Modal
      title="Подтверждение удаления"
      open={isOpen}
      onCancel={onClose}
      onOk={() => onConfirm(record)}
      okText="Удалить"
      cancelText="Отмена"
      okButtonProps={{ danger: true }}
    >
      <p>Вы действительно хотите удалить пользователя <strong>{record?.username}</strong>?</p>
    </Modal>
  );
};

export default DeleteUserModal;