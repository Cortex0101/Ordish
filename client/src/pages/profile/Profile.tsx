import React from "react";
import { Tabs, Tab } from "react-bootstrap";
// import { useTranslation } from 'react-i18next';
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { profileTestIds } from "./Profile.testIds"; // Assuming you have a test IDs file for Profile
import Settings from "./Settings";

import "./Profile.scss"; // Assuming you have a Profile.scss for styles

const Profile: React.FC = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation("profile");

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or loading
  }

  if (!user) {
    window.location.href = "/login"; // Redirect to login if user is not authenticated
  }

  return (
      <Tabs
        defaultActiveKey="tab1"
        id="justify-tab-example"
        className="mb-3"
        data-testid={profileTestIds.tabs}
        justify
      >
        <Tab 
        eventKey="tab1" 
        title={t("tab1-title")}
        data-testid={profileTestIds.tab1}
        >
          Content for account
        </Tab>
        <Tab 
        eventKey="tab2" 
        title={t("tab2-title")}
        data-testid={profileTestIds.tab2}
        >
          Content for friends
        </Tab>
        <Tab 
        eventKey="tab3" 
        title={t("tab3-title")}
        data-testid={profileTestIds.tab3}
        >
          <Settings />
        </Tab>
      </Tabs>
  );
};

export default Profile;
