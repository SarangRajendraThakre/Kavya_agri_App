import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, { ReactNode } from 'react';
import { Colors } from '../utils/Constants';
import { moderateScale } from '../utils/Scaling';

interface WrapperContainerProps {
  children: ReactNode;
}

const WrapperContainer:React.FC<WrapperContainerProps> = ({children}) => {
  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <StatusBar backgroundColor={Colors.white} />
      <View style={{flex: 1, marginHorizontal: moderateScale(38)}}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default WrapperContainer;

const styles = StyleSheet.create({});
