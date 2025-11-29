import React from 'react'
import { Text } from 'react-native'
import { useColorScheme } from 'react-native';

type ThemedTextProps = {
  children: React.ReactNode,
  style?: object
}

const ThemedText:React.FC<ThemedTextProps> = ({children,style}) => {
    const colorScheme = useColorScheme();
  return (
    <Text style={colorScheme==='dark'?{color: 'white',...style}:{color: '#333',...style}}>
      {children}
    </Text>
  )
}

export default ThemedText
