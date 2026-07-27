import { Modal } from 'antd';
import type { User } from '@/types/admin.types';

interface DeleteUserModalProps {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: (record: User | null) => void,
  // onConfirm: (...args: unknown[]) => void,
  user: User | null,
  title: string,
  okButtonText: string,
  bodyText: string,
}

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  user, 
  title, 
  okButtonText, 
  bodyText }: DeleteUserModalProps) => {

  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={onClose}
      
      onOk={() => onConfirm(user)} //!!! все равно для roles иначе

      okText={okButtonText}
      cancelText="Отмена"
      okButtonProps={{ danger: true }}
    >
      {/* <p>Вы действительно хотите удалить пользователя <strong>{record?.username}</strong>?</p> */}
      <p>
        <strong>{user?.username}</strong>: {bodyText}
      </p> 
    </Modal>    
  );
};

export default ConfirmModal;