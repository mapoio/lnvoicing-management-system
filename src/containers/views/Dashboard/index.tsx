import * as React from 'react';

import * as styles from './style.scss';
import { Tables } from './table';

function Dashboard() {
  React.useEffect(() => {
    const title = 'oosh!';
    document.title = title;
    return () => {
      document.title = 'test';
    };
  });
  return (
    <div className={styles.dashboard}>
      <Tables />
    </div>
  );
}

export default Dashboard;
