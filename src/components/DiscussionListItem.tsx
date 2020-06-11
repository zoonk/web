import { useContext } from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Link,
  Typography,
} from '@material-ui/core';
import { Comment } from '@zoonk/models';
import { GlobalContext } from '@zoonk/utils';
import Viewer from './rich-text/Viewer';
import useAuth from './useAuth';

const CommentRemove = dynamic(() => import('./CommentRemove'), { ssr: false });

interface DiscussionListItemProps {
  comment: Comment.Get;
  link?: 'posts' | 'comments';
}

const DiscussionListItem = ({
  comment,
  link = 'comments',
}: DiscussionListItemProps) => {
  const { translate } = useContext(GlobalContext);
  const { user } = useAuth();
  const { createdAt, createdBy, createdById, html, id, postId } = comment;
  const isAuthor = createdById === user?.uid;
  const isModerator = user?.role === 'moderator' || user?.role === 'admin';
  const canDelete = isAuthor || isModerator;
  const linkId = link === 'posts' ? postId : id;

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={
          <NextLink
            href="/profile/[id]"
            as={`/profile/${createdBy.username}`}
            passHref
          >
            <a>
              <Avatar
                src={createdBy.photo || undefined}
                alt={createdBy.name}
                title={createdBy.name}
              />
            </a>
          </NextLink>
        }
        title={
          <NextLink
            href="/profile/[id]"
            as={`/profile/${createdBy.username}`}
            passHref
          >
            <Link color="textPrimary">
              <Typography variant="h6">{createdBy.name}</Typography>
            </Link>
          </NextLink>
        }
        subheader={createdAt}
      />
      <CardContent>
        <Viewer html={html} />
      </CardContent>
      <CardActions disableSpacing>
        <NextLink href={`/${link}/[id]`} as={`/${link}/${linkId}`} passHref>
          <Button component="a" color="primary">
            {translate('see_discussion')}
          </Button>
        </NextLink>

        {canDelete && <CommentRemove id={id} />}
      </CardActions>
    </Card>
  );
};

export default DiscussionListItem;
