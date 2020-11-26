import React from 'react';
import { useUser } from '../context/userContext';
import { getRelativeTime } from '../utilities/relativeTime';

export default function Message(props) {
  let { text, sender, time, refTime } = props;
  const { user } = useUser();

  let className = sender === user ? 'own' : '';
  if (sender === 'system') {
    className += ' system';
    text = text.replace(/{(.*)}/g, (match, p1) => (p1 === user ? 'You' : p1));
    sender = '';
  }
  const timeStr = getRelativeTime(new Date(time), refTime);

  return (
    <li className={className}>
      {sender ? (
        <div className="sender">{sender === user ? 'You' : sender}</div>
      ) : (
        ''
      )}
      <div className="content">{text}</div>
      <div className="time-stamp">{timeStr}</div>
    </li>
  );
}
