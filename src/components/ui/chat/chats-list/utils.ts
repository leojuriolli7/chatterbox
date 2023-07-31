import type { ChatWithMessagesAndUsers, UpdateChatEventPayload } from "@/types";

export function updateSeenFromLastMessage<T extends ChatWithMessagesAndUsers>(
  chats: T[],
  { id, messageId, currentUser }: UpdateChatEventPayload
): T[] {
  const chatMap: { [id: string]: T } = {};

  // Build the map with "id" as the key for faster access
  for (const chat of chats) {
    chatMap[chat.id] = chat;
  }

  const chatToUpdate = chatMap[id];

  if (chatToUpdate) {
    const messageToUpdate = chatToUpdate.messages.find(
      (message) => message.id === messageId
    );

    if (messageToUpdate) {
      messageToUpdate.seenIds.push(currentUser.id);
      messageToUpdate.seen.push(currentUser);
    }
  }

  // Convert the values of the map back to an array
  return Object.values(chatMap);
}

export function addNewLastMessage<T extends ChatWithMessagesAndUsers>(
  chats: T[],
  newObj: T
): T[] {
  const dataMap: { [id: string]: T } = {};

  // build the map with "id" as the key for faster access
  for (const obj of chats) {
    dataMap[obj.id] = obj;
  }

  if (newObj.id in dataMap) {
    // chat with the same "id" found, update its messages
    dataMap[newObj.id].messages = newObj.messages;
  } else {
    // chat not found, add the new object to the map
    dataMap[newObj.id] = newObj;
  }

  // convert the values of the map back to an array
  const updatedArray = Object.values(dataMap);

  // move the updated chat to first position
  const foundIndex = updatedArray.findIndex((item) => item.id === newObj.id);
  if (foundIndex !== -1) {
    const objToUpdate = updatedArray[foundIndex];
    updatedArray.splice(foundIndex, 1);
    updatedArray.unshift(objToUpdate);
  }

  return updatedArray;
}
