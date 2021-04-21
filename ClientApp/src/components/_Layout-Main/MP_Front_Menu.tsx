import * as React from 'react'
import LayoutMain from './interface';

interface option {
    id?: string,
    source: Array<LayoutMain.Menu>,
    isSide?: boolean,
}

export default class MP_Front_Menu extends React.PureComponent<option, {}>{
    private n: number = 0;
    private SideNav = {
        GetElement: () => { return document.getElementById(this.props.id || "") },
        CurrentLevel: 0,
        TranslateX: function () {
            let Menu = this.GetElement();
            let nLengthTranslate = this.CurrentLevel * -100;
            if (Menu) Menu.style.transform = 'translateX(' + nLengthTranslate + '%)';
        },
        Next: function () { this.CurrentLevel += 1; this.TranslateX(); },
        Previous: function (toFirst?: boolean) {
            toFirst = Boolean(toFirst);
            this.CurrentLevel -= (toFirst ? this.CurrentLevel : 1);
            this.TranslateX();
            let Menu = this.GetElement();
            if (Menu && toFirst) {
                let menu_current = Menu.getElementsByClassName("menu-current");
                Array.prototype.forEach.call(menu_current, function (m) { m.classList.remove("menu-current"); });
            }
        },
        LinkNext_onClick: (e: React.MouseEvent) => {
            e.currentTarget.classList.add("menu-current");
            this.SideNav.Next();
            e.preventDefault();
        },
        LinkPrev_onClick: (e: React.MouseEvent) => {
            this.SideNav.Previous();
            let tag_li = e.currentTarget.parentElement; //<li>
            let tag_ul = tag_li ? tag_li.parentElement : null; //<ul>
            let tag_link = tag_ul ? (tag_ul.classList.contains("menu-sub") ? tag_ul.previousElementSibling : null) : null; //<a>
            if (tag_link) tag_link.classList.remove("menu-current");
            e.preventDefault();
        },
        Build: (arrMenu: Array<LayoutMain.Menu>, isSide?: boolean) => {
            return (arrMenu.map((m, i) => {
                this.n += 1;
                return (<li key={this.n}>
                    <a href={m.to} className={((m.children ? "has-children " : "") + (m.active ? "active" : "")).trim()}
                        onClick={isSide && m.children ? this.SideNav.LinkNext_onClick : undefined}>
                        {m.icon ? <div className="link-icon">{m.icon}</div> : null}
                        <div className="link-label">{m.label}</div>
                        {m.children
                            ? <div className="link-caret">{isSide ? <i className="fa fa-chevron-right"></i> : <i className="fa fa-chevron-down"></i>}</div>
                            : null}
                    </a>
                    {m.children
                        ? <ul className="menu menu-sub">
                            {isSide
                                ? <li>
                                    <a className="link-back" onClick={this.SideNav.LinkPrev_onClick}>
                                        <div className="link-icon"><i className="fa fa-chevron-left"></i></div>
                                        <div className="link-label">Back</div>
                                    </a>
                                </li>
                                : null}
                            {this.SideNav.Build(m.children)}
                        </ul>
                        : null}
                </li>)
            }
            ))
        }
    };

    public render() {
        return (
            <React.Fragment>
                <ul id={this.props.id} className="menu">{this.SideNav.Build(this.props.source, this.props.isSide)}</ul>
            </React.Fragment>
        )
    }
}
