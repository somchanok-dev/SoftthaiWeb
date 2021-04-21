import * as React from "react";
import { Route, Switch, Router } from "react-router";

import "./custom.css";
import { createBrowserHistory } from "history";

import LayoutFront from "./components/_Layout-Main/MP_Front";
import LayoutBack from "./components/_Layout-Admin/MP_Back";
import Home from "./components/main-home/Home";
import About from "./components/main-about/about";
import Project from "./components/main-project/project"
import CustomerCare from "./components/main-contact/contact";
import Userpermission from "./components/admin-user/Userpermission";
import TabGroup from "./components/admin-user/TabGroup";
import TabAdmin from "./components/admin-user/TabAdmin";
import Login from "./components/admin-login/Login";
import T_New from "./components/admin-news/T_New";
import T_New_list from "./components/admin-news/T_New_list";
import T_Project_list from "./components/admin-project/T_Project_list";
import T_Project_edit from "./components/admin-project/T_Project";
// import SupportType from "./components/admin-supporttype/SupportType";
// import SupportTypeEdit from "./components/admin-supporttype/SupportTypeEdit";
import T_MasterType from "./components/admin-master/MasterType";
import T_Master_List from "./components/admin-master/Master_List/Master_List";
import T_Master_Edit from "./components/admin-master/Master_Edit/Master_Edit";
import CustomerCareList from "./components/customer-care/CustomerCare";
import CustomerCareDetail from "./components/customer-care/CustomerCareDetail";
import Customer_edit from "./components/admin-customer/T_Customer_edit";
import Customer_list from "./components/admin-customer/T_Customer_list";
import content from "./components/admin-content/content_list";
import { useState } from "react";
import Contact_Info from "./components/admin-contactinfo/Contact_Info";
import Home_Panel1 from "./components/main-home/PANE_1/Home_Panel1";
import ContactInfo_Edit from "./components/admin-contactinfo/ContactInfo_Edit";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href") as string;
const history = createBrowserHistory({ basename: baseUrl });
export function getHistory() { return history; }
function App() {
    const [lstTitle, setlstTitle] = useState({} as any);

    function handleClick(e) {
        setlstTitle(e)
    }
    const route = [
        { path: "/", component: Home, layout: LayoutFront, exact: true, layoutProps: { MenuID_Selected: 1 } },
        { path: "/about", component: About, layout: LayoutFront, layoutProps: { MenuID_Selected: 2 } },
        { path: "/works", component: Project, layout: LayoutFront, layoutProps: { MenuID_Selected: 3 } },
        { path: "/customer_care", component: CustomerCare, layout: LayoutFront, layoutProps: { MenuID_Selected: 4 } },
        //{ path: "/admin-login", component: Login, layout: Login },
        { path: "/admin-login", component: Login },
        { path: "/admin-user", component: Userpermission, layout: LayoutBack, layoutProps: { title: "สิทธิผู้ดูแลระบบ", MenuID_Selected: 1 } },
        { path: "/admin-user_group-edit", component: TabGroup, layout: LayoutBack, layoutProps: { title: "กลุ่มผู้ดูแลระบบ", MenuID_Selected: 1 } },
        { path: "/admin-user_info-edit", component: TabAdmin, layout: LayoutBack, layoutProps: { title: "ข้อมูลผู้ดูแลระบบ", MenuID_Selected: 1 } },
        { path: "/admin-news", component: T_New_list, layout: LayoutBack, layoutProps: { title: "จัดการข้อมูลข่าว", MenuID_Selected: 2 } },
        { path: "/admin-news-edit", component: T_New, layout: LayoutBack, layoutProps: { title: "จัดการข้อมูลข่าว", MenuID_Selected: 2 } },
        { path: "/admin-project", component: T_Project_list, layout: LayoutBack, layoutProps: { title: "จัดการข้อมูลโครงการ", MenuID_Selected: 3 } },
        { path: "/admin-project-edit", component: T_Project_edit, layout: LayoutBack, layoutProps: { title: "จัดการข้อมูลโครงการ", MenuID_Selected: 3 } },
        // { path: "/admin-support_type", component: SupportType, layout: LayoutBack, layoutProps: { title: "ประเภทเรื่อง", MenuID_Selected: 4 } },
        // { path: "/admin-support_type-edit", component: SupportTypeEdit, layout: LayoutBack, layoutProps: { title: "ประเภทเรื่อง", MenuID_Selected: 4 } },
        ///admin-master
        { path: "/admin-master", component: T_MasterType, layout: LayoutBack, layoutProps: { title: "ข้อมูลพื้นฐาน", Sublsttitle: lstTitle,MenuID_Selected: 5 } },
        { path: "/admin-master-list", component: T_Master_List, layout: LayoutBack, layoutProps: { titleIcon: "", title: "ข้อมูลพื้นฐาน ", Sublsttitle: lstTitle, MenuID_Selected: 5 } },
        { path: "/admin-master-edit", component: T_Master_Edit, layout: LayoutBack, layoutProps: { title: "ข้อมูลพื้นฐาน ", Sublsttitle: lstTitle, MenuID_Selected: 5 } },

        { path: "/admin-customer_care", component: CustomerCareList, layout: LayoutBack, layoutProps: { title: "บริการลูกค้า",MenuID_Selected: 6 } },
        { path: "/admin-customer_care-view", component: CustomerCareDetail, layout: LayoutBack, layoutProps: { title: "บริการลูกค้า", MenuID_Selected: 6 } },
        { path: "/admin-customer", component: Customer_list, layout: LayoutBack, layoutProps: { title: "ข้อมูลลูกค้า", MenuID_Selected: 7 } },
        { path: "/admin-customer-edit", component: Customer_edit, layout: LayoutBack, layoutProps: { title: "ข้อมูลลูกค้า", MenuID_Selected: 7 } },
        { path: "/admin-contact_info", component: Contact_Info, layout: LayoutBack, layoutProps: { title: "ข้อมูลสำหรับติดต่อ", MenuID_Selected: 8 } },
        { path: "/admin-content/home_panel1", component: Home_Panel1, layout: LayoutBack, layoutProps: { title: "Introduction Video", MenuID_Selected: 8 } },
        { path: "/admin-contact_info-edit", component: ContactInfo_Edit, layout: LayoutBack, layoutProps: { title: "ข้อมูลสำหรับติดต่อ", MenuID_Selected: 8 } },
        { path: "/admin-content", component: content, layout: LayoutBack, layoutProps: { title: "เนื้อหาและบทความ", MenuID_Selected: 8 } },
        { path: "/admin-content/home_panel1", component: Home_Panel1, layout: LayoutBack, layoutProps: { title: "ข้อมูลสำหรับติดต่อ", MenuID_Selected: 8 } },
    ];

    return (
        <Router history={history}>
            <Switch>
                {route.map((o: any) => {
                    return (
                        <Route path={o.path} key={o.path} exact={o.exact}>
                            {o.layout
                                ? <o.layout {...o.layoutProps}><o.component Title={handleClick} /></o.layout>
                                : <o.component />
                            }
                        </Route>
                    );
                })}
            </Switch>
        </Router>
    );
}

export default App;
