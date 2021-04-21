import * as React from 'react'
import { NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

export = LayoutMain;
export as namespace LayoutMain;

declare namespace LayoutMain {
    export interface Menu {
        icon?: string;
        label: string;
        to?: string;
        active?: boolean;
        children?: Array<Menu>
    }
}