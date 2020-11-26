import React, { useRef, useEffect } from 'react';
import Message from './Message';

export default function MessagesContainer(props) {
  const { messages, refTime } = props;
  const scrollArea = useRef(null);

  useEffect(() => {
    scrollArea?.current?.lastElementChild?.scrollIntoView({
      block: 'end',
    });
  });
  return (
    <ul ref={scrollArea} className="messages-container">
      {messages.map((props, index) => (
        <Message key={index} refTime={refTime} {...props} />
      ))}
    </ul>
  );
}
