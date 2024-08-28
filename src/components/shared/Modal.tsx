import React from "react";
import ReactDOM from "react-dom";
import { UsersType } from "@/hooks/get-users";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  userModal: UsersType;
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, userModal }) => {
  if (!isOpen) {
    return null;
  }

  const modalRoot = document.getElementById("modal-root");

  if (!modalRoot) {
    throw new Error("Modal root element not found");
  }

  console.log(userModal);

  return ReactDOM.createPortal(
    <div onClick={onClose} className="w-[100%] h-[100%] bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center">
      <div onClick={(e) => e.stopPropagation()} className="flex justify-between items-center rounded-2xl border border-slate-[#292524] w-[30%] max-w-[800px] p-3 bg-[#0c0a09]">
        <div>
          <img width={300} src="./public/user.png" alt="user" />
        </div>

        <div>
          <div className="mb-3">
            <p className="opacity-50 text-[10px] italic">ФИО:</p>
            <h2>{userModal.firstName} {userModal.lastName} {userModal.maidenName}</h2>
          </div>

          <div className="flex mb-3">
            <div className="mr-10">
              <p className="opacity-50 text-[10px] italic">Возраст:</p>
              <h2>{userModal.age}</h2>
            </div>

            <div className="mr-10">
              <p className="opacity-50 text-[10px] italic">Рост:</p>
              <h2>{userModal.height}</h2>
            </div>

            <div>
              <p className="opacity-50 text-[10px] italic">Вес:</p>
              <h2>{userModal.weight}</h2>
            </div>
          </div>

          <div className="mb-3">
            <div className="mr-10 mb-3">
              <p className="opacity-50 text-[10px] italic">Номер:</p>
              <h2>{userModal.phone}</h2>
            </div>

            <div className="mr-10">
              <p className="opacity-50 text-[10px] italic">Почта:</p>
              <h2>{userModal.email}</h2>
            </div>
          </div>

          <div className="mr-10 mb-3">
            <p className="opacity-50 text-[10px] italic">Адрес:</p>
            <h2>{userModal.address.toString()}</h2>
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  );
};
