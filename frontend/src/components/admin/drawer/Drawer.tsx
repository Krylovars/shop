import {type ReactNode} from 'react';
import './Drawer.scss';

type DrawerProps = {
    children?: ReactNode,
    isOpen?: boolean,
    onClose?: () => void
};

export function Drawer({children, isOpen = false, onClose}: DrawerProps) {
    if (!isOpen) return null;
    return (
        <>
            <div className="drawer">
                {children}
            </div>
            <div className="drawer-overlay" onClick={onClose}></div>
        </>
    );
}