import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import PostsCard from '@zoonk/components/PostsCard';
import PostShare from '@zoonk/components/PostShare';
import Meta from '@zoonk/components/Meta';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import { analytics, GlobalContext, theme } from '@zoonk/utils';

const GroupQuestions: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();
  const groupId = String(query.id);

  useEffect(() => {
    analytics().setCurrentScreen('group_questions');
  }, []);

  return (
    <Container component="main">
      <Meta title={translate('questions')} noIndex />
      <GroupsBreadcrumb groupId={groupId} title={translate('questions')} />
      <PostShare
        category="questions"
        title={translate('ask_question')}
        groupId={groupId}
      />
      <div style={{ margin: theme.spacing(1, 0) }} />
      <PostsCard category={['questions']} groupId={groupId} limit={10} />
    </Container>
  );
};

export default GroupQuestions;
