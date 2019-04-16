import * as React from 'react'

import * as styles from './index.scss'
import Header from './Header'
import UserTable from './Table'
import AutoSizer from '@components/AutoSizer'

export default function Users() {
    return (
        <div className={styles.container}>
            <Header />
            <AutoSizer className={styles.tableBox}>{({ height }) => <UserTable scrollY={height - 120} />}</AutoSizer>
        </div>
    )
}
