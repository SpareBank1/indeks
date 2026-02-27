import { Outlet } from 'react-router-dom';
import PMFooter from './PMFooter';

export default function Wrapper() {
    return (
        <div className="ix-color-background-default">
            <Outlet />
            <PMFooter />
        </div>
    );
}
