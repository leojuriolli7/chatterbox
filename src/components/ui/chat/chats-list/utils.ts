import type { ChatWithMessagesAndUsers, UpdateChatEventPayload } from "@/types";
import { differenceInDays, isToday, isYesterday } from "date-fns";
import format from "date-fns/format";
export function updateSeenFromLastMessage<T extends ChatWithMessagesAndUsers>(
  chats: T[],
  payload: UpdateChatEventPayload
): T[] {
  const { id, messageId, currentUser } = payload;

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

const patterns = {
  date: "MM/dd/yyyy",
  time: "HH:mm",
  shortDate: "MMM dd, yyyy",
  dayAndMonth: "dd/MM",
  smart: "MMM dd, yyyy",
  dayOfWeek: "EEEE",
} as const;
type Pattern = keyof typeof patterns;

export function formatLastMessageDate(date: Date) {
  if (!date) {
    return "";
  }

  let pattern: Pattern = "time";

  const diffInDays = differenceInDays(new Date(), date);
  const isThisWeek = diffInDays <= 7;
  const notThisWeek = diffInDays > 7;
  const isThisYear = diffInDays <= 365;
  const isMoreThanOneYearOld = diffInDays > 365;

  if (!isToday(date) && isThisWeek) {
    if (isYesterday(date)) {
      return "Yesterday";
    } else {
      pattern = "dayOfWeek";
    }
  }

  if (notThisWeek && isThisYear) {
    pattern = "dayAndMonth";
  }

  if (isMoreThanOneYearOld) {
    pattern = "shortDate";
  }

  try {
    const formattedDate = format(new Date(date), patterns[pattern || "date"]);

    return formattedDate;
  } catch (e) {
    console.log("e:", e);
    return "";
  }
}
