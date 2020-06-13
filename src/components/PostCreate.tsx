import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { timestamp } from '@zoonk/firebase/db';
import { Post } from '@zoonk/models';
import { createPost, getChapter } from '@zoonk/services';
import { appLanguage, getPostLinks } from '@zoonk/utils';
import CategorySelector from './CategorySelector';
import PostForm from './PostForm';
import useSnackbar from './useSnackbar';
import useAuth from './useAuth';

interface PostCreateProps {
  category?: Post.Category;
  chapterId?: string;
  groupId?: string;
  pinned?: boolean;
  topicId?: string;
  onCategoryChange: (category?: Post.Category) => void;
}

const PostCreate = ({
  category,
  chapterId,
  groupId,
  pinned,
  topicId,
  onCategoryChange,
}: PostCreateProps) => {
  const { profile, user } = useAuth();
  const { push } = useRouter();
  const { action, snackbar } = useSnackbar();
  const [topicIds, setTopics] = useState<string[]>(topicId ? [topicId] : []);

  useEffect(() => {
    if (chapterId) {
      getChapter(chapterId).then((res) => {
        if (res) setTopics(res.topics);
      });
    }
  }, [chapterId]);

  if (!user || !profile) {
    return null;
  }

  if (!category) {
    return <CategorySelector onSelect={onCategoryChange} />;
  }

  const redirect = (id: string) => {
    snackbar('success');
    push('/posts/[id]', `/posts/${id}`);
  };

  const handleSubmit = async (
    data: Omit<Post.EditableFields, 'pinned'>,
    topics: string[],
  ) => {
    snackbar('progress');
    createPost({
      ...data,
      category,
      chapterId: chapterId || null,
      comments: 0,
      createdAt: timestamp,
      createdBy: profile,
      createdById: user.uid,
      delta: JSON.stringify(data.delta),
      groupId: groupId || null,
      language: appLanguage,
      likes: 0,
      links: data.links || getPostLinks(data.delta),
      pinned: Boolean(pinned),
      topics,
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: user.uid,
    })
      .then(redirect)
      .catch((e) => snackbar('error', e.message));
  };

  return (
    <PostForm
      category={category}
      topicIds={topicIds}
      saving={action === 'progress' || action === 'success'}
      onSubmit={handleSubmit}
    />
  );
};

export default PostCreate;
