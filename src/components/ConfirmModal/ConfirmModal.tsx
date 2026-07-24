import { Modal } from 'antd';
import type { User } from '@/types/admin.types';

interface DeleteUserModalProps {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: (record: User | null) => void,
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
      // title="Подтверждение удаления"
      title={title}

      open={isOpen}
      onCancel={onClose}
      onOk={() => onConfirm(user)}

      // okText="Удалить"
      okText={okButtonText}

      cancelText="Отмена"
      okButtonProps={{ danger: true }}
    >
      {/* <p>Вы действительно хотите удалить пользователя <strong>{record?.username}</strong>?</p> */}
      <p>
        <strong>{user?.username}</strong>: {bodyText}
      </p> 
    </Modal>
    // <Modal
    //   title="Подтверждение удаления"
    //   open={isOpen}
    //   onCancel={onClose}
    //   onOk={() => onConfirm(record)}
    //   okText="Удалить"
    //   cancelText="Отмена"
    //   okButtonProps={{ danger: true }}
    // >
    //   <p>Вы действительно хотите удалить пользователя <strong>{record?.username}</strong>?</p>
    // </Modal>
    
  );
};

export default ConfirmModal;