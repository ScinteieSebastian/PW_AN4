import React, { useState, useEffect } from "react";
import styles from "./HomePage.module.scss";
import Breadcrumbs from "@trendmicro/react-breadcrumbs";
import ensureArray from "ensure-array";
import styled from "styled-components";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";
import AuthenticationService from "../../services/Authentication.service";
import AcceptTermns from "../../services/AcceptTermns.service";
import FAQPage from "../FAQPage/FAQPage";
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import GridGamesPage from "../GridGamesPage/GridGamesPage";
import CreateGamePage from "../CreateGamePage/CreateGamePage";
import CheckIcon from '@material-ui/icons/Check';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import UsersList from "../../components/UsersList";

const Main = styled.main`
position: relative;
overflow: hidden;
transition: all 0.15s;
padding: 0 20px;
margin-left: ${props => props.expanded ? 240 : 64}px;
`;

const AdminPage: React.FC = (props: any) => {
  const [value, setState] = useState({
    selected: "home",
    expanded: false,
  });

  useEffect(() => {

  })


  const [pageTitle, setPageTitle] = useState({
    home: "Home",
    create: ["Create a new Game"],
    approve: ["Approve Game"],
    users: ["Users"],
    "support/faq": ["Support", "FAQ Page"],
  });

  function onSelect(selected) {
    setState({ selected: selected, expanded: value.expanded });
  };
  function onToggle(expanded) {
    value.expanded = expanded;
    setState({ selected: value.selected, expanded: expanded });
  };


  function renderBreadcrumbs() {
    var returnedComponent = (<div></div>)
    switch (value.selected) {
      case "home":
        returnedComponent = (
          <GridGamesPage children={{ isHome: false }} />
        )
        break;
      case "create":
        returnedComponent = (
          <CreateGamePage />
        )
        break;
      case "approve":
        returnedComponent = (
          <GridGamesPage children={{ isHome: true }} />
        )
        break;
      case "users":
        returnedComponent = (
          <UsersList />
        )
        break;
      case "support/faq":
        returnedComponent = (
          <FAQPage />
        )
        break;
      default:
        break;
    }

    return (
      <div style={{ padding: "15px", position: "relative", height: "90vh", overflowY: "auto", overflowX: "hidden" }}>
        {returnedComponent}
      </div>
    );
  };

  const navigate = (pathname) => () => {
    setState({ selected: pathname, expanded: value.expanded });
  };

  return (
    <div>
      {!AuthenticationService.currentUserValue.termns && (<AcceptTermns />)}
      <SideNav onSelect={onSelect} onToggle={onToggle} style={{ top: "55px" }}>
        <SideNav.Toggle />
        <SideNav.Nav selected={value.selected}>
          <NavItem eventKey="home">
            <NavIcon>
              <i
                className="fa fa-fw fa-home"
                style={{ fontSize: "1.75em", verticalAlign: "middle" }}
              />
            </NavIcon>
            <NavText style={{ paddingRight: 32 }} title="Home">
              Home User
            </NavText>
          </NavItem>
          <NavItem eventKey="create">
            <NavIcon>
              <i
                className="fa fa-plus-circle"
                style={{ fontSize: "1.75em", verticalAlign: "middle" }}
              />
            </NavIcon>
            <NavText style={{ paddingRight: 32 }} title="Create a new Game">
              Create a new Game
            </NavText>
          </NavItem>
          <NavItem eventKey="approve">
            <NavIcon>
              <CheckIcon style={{ fontSize: "1.75em", verticalAlign: "middle" }} />
            </NavIcon>
            <NavText style={{ paddingRight: 32 }} title="Approve Game">
              Approve Game
            </NavText>
          </NavItem>
          <NavItem eventKey="users">
            <NavIcon>
              <PeopleAltIcon style={{ fontSize: "1.75em", verticalAlign: "middle" }} />
            </NavIcon>
            <NavText style={{ paddingRight: 32 }} title="Users">
              Users
            </NavText>
          </NavItem>
          <NavItem eventKey="settings">
            <NavIcon>
              <LiveHelpIcon style={{ fontSize: "1.75em", verticalAlign: "middle" }} />
            </NavIcon>
            <NavText style={{ paddingRight: 32 }} title="Support">
              Support
            </NavText>
            <NavItem eventKey="support/faq">
              <NavText title="FAQ Page">FAQ Page</NavText>
            </NavItem>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
      <Main expanded={value.expanded} >{renderBreadcrumbs()}</Main>

    </div>
  );
};

export default AdminPage;
