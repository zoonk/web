import { useContext } from 'react';
import NextLink from 'next/link';
import { Link, Typography } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';

/**
 * Display a support message asking if a user is having any issues.
 */
const HavingIssuesLink = () => {
  const { translate } = useContext(GlobalContext);

  return (
    <Typography variant="body2">
      {translate('having_issues')}{' '}
      <NextLink href="/contact?source=issues" passHref>
        <Link>{translate('let_us_know')}</Link>
      </NextLink>
    </Typography>
  );
};

export default HavingIssuesLink;
