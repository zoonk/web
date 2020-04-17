import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import SidebarPage from '@zoonk/components/SidebarPage';
import { analytics, GlobalContext, rootUrl } from '@zoonk/utils';

const Books: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('books');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('books')}
        description={translate('seo_books_desc')}
        canonicalUrl={`${rootUrl}/books`}
      />
      <SidebarPage>
        <PostsCard category={['books']} limit={10} listOnly allowLoadMore />
      </SidebarPage>
    </Container>
  );
};

export default Books;
