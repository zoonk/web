import { RawFirebaseTimestamp } from '@zoonk/models';
import { appLanguage } from '@zoonk/utils';
import firebase from '@zoonk/utils/firebase';

/**
 * Convert a Firebase date to a string using the app's default locale.
 */
export const serializeFirebaseDate = (
  date: RawFirebaseTimestamp | undefined,
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  },
): string => {
  const { Timestamp } = firebase.firestore;
  const newDate = date
    ? new Timestamp(date.seconds, date.nanoseconds).toDate()
    : new Date();

  return newDate.toLocaleDateString(appLanguage, options);
};
