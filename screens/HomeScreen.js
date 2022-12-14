import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import {auth} from '../firebase'
import {useNavigation} from '@react-navigation/core'

const HomeScreen = () => {
    const navigation = useNavigation();

    const handleSignOut = () => {
        auth
        .signOut()
        .then(() => { 
        navigation.replace("LoginPage");
        })
        .catch(error => alert(error.message))
    }

    const handleButtonClick01 = () => {
        navigation.replace("LoginPage");
    }

    return (
        <View style={styles.container}>
            <Text>Email : {auth.currentUser?.email}</Text>
            <TouchableOpacity
                onPress={handleSignOut}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
            {/*<TouchableOpacity>Camera page</TouchableOpacity>*/}
            <View>
                <TouchableOpacity
                onPress={handleButtonClick01}>
                    <Text>Camera page</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button:{
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40
      },
      buttonText:{
        color: 'white',
        fontWeight: '700',
        fontSize: 16
      },
})