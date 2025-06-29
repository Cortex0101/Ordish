import React, { useState } from 'react';
import { 
  Container, 
  Spinner
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

import './Profile.scss'; // Assuming you have a Profile.scss for styles
import Banner from './Banner';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation(['profile']);

  if (!user) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="profile-container">
      <Banner
        userName={user.username || user.email}
        userVisitedCount={undefined} // Assuming you will fetch this data
        userVisitedDays={undefined}
        userJoinedDate={undefined}
        userLastActive={undefined}
        userAvatarUrl={user.avatar_url}
        userFriendsCount={undefined}
      />
    </Container>
  )
};

export default Profile;
