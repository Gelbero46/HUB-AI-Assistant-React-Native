import { useState, useEffect } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

interface UseKeyboardReturn {
  isKeyboardVisible: boolean;
  keyboardHeight: number;
}

export const useKeyboard = (): UseKeyboardReturn => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShow = (event: KeyboardEvent) => {
      setIsKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates.height);
    };

    const keyboardDidHide = () => {
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
    };

    const showListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    const hideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return {
    isKeyboardVisible,
    keyboardHeight,
  };
};
