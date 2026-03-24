import {type ReactNode} from 'react';

type TableProps = {
    children?: ReactNode;
};

export function Table({children}: TableProps) {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
                <tfoot>
                    <tr>
                        <td>Total</td>
                        <td>100</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}