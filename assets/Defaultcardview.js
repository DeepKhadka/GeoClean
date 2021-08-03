
import React from 'react';
import { StyleSheet, View,Text, TouchableOpacity } from 'react-native';


export default function DefaultCard({text,onPress})
{
    return(
        <View style={styles.mainView}>
            <TouchableOpacity style={styles.card} onPress={onPress}>
            <Text style={styles.text}>{text}</Text>
            </TouchableOpacity>
       
       
     
       
    </View>
    )
}

const styles= StyleSheet.create({
    card:{
       height:"80%",
       width:"100%",
     
       justifyContent:"center"
       
    },
    mainView :{

       alignItems:"center",
       justifyContent:"space-between"
    },
    text :{
      
        fontSize: 32,
    }

});