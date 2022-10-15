import { StyleSheet, Text, View, Dimensions, TextInput, Pressable } from 'react-native'
import React, {useState, useEffect} from 'react'
import Svg, {Image, Ellipse, ClipPath} from 'react-native-svg';
import { height } from '../Ditection';
import Animated, {useSharedValue, useAnimatedStyle, interpolate, withTiming, withDelay, runOnJS} from 'react-native-reanimated';
import {auth, firebase} from '../../firebase';
import {useNavigation} from '@react-navigation/core';

const Login = () => {
    const {height, width} = Dimensions.get('window');
    const imagePosition = useSharedValue(1);
    const formButtonScale = useSharedValue(1)
    const [isRegistering, setIsRegistering] = useState('false');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
        if(user){
            navigation.replace("Home")
        }
        })
        return unsubscribe;
    },[])

    const handleSignUp = () => {
        auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredentials => {
          const user = userCredentials.user;
          //console.log('Registered with : ',user.email);
          alert('User registered!')
        })
        .catch((error) => {
            alert(error.message)
        })
        .then(() => {
            firebase.firestore().collection('users')
            .doc(firebase.auth().currentUser.uid)
            .set({
                email,
                fullName,
            })
        })
        .catch((error) => {
            alert(error.message)
        })
    }

    const handleLogin = () => {
        auth
          .signInWithEmailAndPassword(email, password)
          .then(userCredentials => {
            const user = userCredentials.user;
            //console.log('Logged in with : ',user.email);
            //navigation.replace("Home")
          })
          .catch(error => alert(error.message))
    }

    const imageAnimatedStyle = useAnimatedStyle(() => {
        const interpolation = interpolate(imagePosition.value, [0, 1], [-height / 2, 0])
        'worklet'
        return{
            transform: [{translateY: withTiming(interpolation, {duration: 1000})}]
        }
    })

    const buttonAnimatedStyle = useAnimatedStyle(() => {
        const interpolation = interpolate(imagePosition.value, [0, 1], [250, 0]);
        return {
            opacity: withTiming(imagePosition.value, {duration: 500}),
            transform: [{translateY: withTiming(interpolation, {duration: 1000})}]
        }
    })

    const closeButtonContainerStyle = useAnimatedStyle(() => {
        const interpolation = interpolate(imagePosition.value, [0, 1], [180, 360]);
        return{
            opacity: withTiming(imagePosition.value === 1 ? 0 : 1, {duration: 800}),
            transform: [{rotate: withTiming(interpolation + "deg", {duration: 1000})}]
        }
    })

    const formAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: 
                imagePosition.value === 0
                    ? withDelay(400, withTiming(1, {duration: 800}))
                    : withTiming(0, {duration: 300})
        }
    })

    const formButtonAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: formButtonScale.value}]
        }
    })

    const loginHandler = () => {
        imagePosition.value = 0;
        if(isRegistering){
            setIsRegistering(false);
        }
    }

    const registerHandler = () => {
        imagePosition.value = 0;
        if(!isRegistering){
            setIsRegistering(true);
        }
    }

    return (
        <View style={styles.container}>
            <Animated.View style={[StyleSheet.absoluteFill, imageAnimatedStyle]}>
                <Svg height={height} width={width}>
                    <ClipPath id='clipPathid'>
                        <Ellipse cx={width / 2} rx={height} ry={height}/>
                    </ClipPath>
                    <Image href={require('../../assets/background3.jpg')} 
                        width={width} height={height + 20} 
                        preserveAspectRatio='xMidYMid slice'
                        clipPath="url(#clipPathid)"
                    />
                </Svg>
                <Animated.View style={[styles.closeButtonContainer, closeButtonContainerStyle]}>
                    <Text onPress={() => imagePosition.value = 1}>X</Text>
                </Animated.View>
            </Animated.View>
            <View style={styles.buttonContainer}>
                <Animated.View style={buttonAnimatedStyle}>
                    <Pressable style={styles.button} onPress={loginHandler}>
                        <Text style={styles.buttonText}>LOG IN</Text>
                    </Pressable>
                </Animated.View>
                <Animated.View style={buttonAnimatedStyle}>
                    <Pressable style={styles.button} onPress={registerHandler}>
                        <Text style={styles.buttonText}>REGISTER</Text>
                    </Pressable>
                </Animated.View>
                <Animated.View style={[styles.formInputContainer, formAnimatedStyle]}>
                    
                    <TextInput 
                        placeholder='Email' 
                        placeholderTextColor={'black'} 
                        style={styles.textInput}
                        value={email}
                        onChangeText={text => setEmail(text)}
                    />
                    
                    {isRegistering && (
                            <TextInput 
                                placeholder='Full Name' 
                                placeholderTextColor={'black'} 
                                style={styles.textInput}
                                value={fullName}
                                onChangeText={text => setFullName(text)}
                            />
                        )
                    }
                    
                    <TextInput 
                        placeholder='Password' 
                        placeholderTextColor={'black'} 
                        style={styles.textInput}
                        secureTextEntry
                        value={password}
                        onChangeText={text => setPassword(text)}
                    />
                    
                    <Animated.View style={[styles.formButton, formButtonAnimatedStyle]}>
                        {/*<Pressable>
                            <Text style={styles.buttonText}>{isRegistering ? "REGISTER" : "LOG IN"}</Text>
                        </Pressable>*/}
                        {isRegistering ? 
                            (
                                <Pressable onPress={handleSignUp}>
                                    <Text style={styles.buttonText}>REGISTER</Text>
                                </Pressable>
                            )
                            : (
                                <Pressable onPress={handleLogin}>
                                    <Text style={styles.buttonText}>LOG IN</Text>
                                </Pressable>
                            )
                        }
                    </Animated.View>
                </Animated.View>
            </View>

        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    button: {
        backgroundColor: 'rgba(123, 104, 238, 0.8)',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
        marginHorizontal: 20,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'white'
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
        letterSpacing: 0.5
    },
    buttonContainer: {
        justifyContent: 'center',
        height: height / 3,
    },
    textInput: {
        height: 50,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 25,
        paddingLeft: 10
    },
    formButton: {
        backgroundColor: 'rgba(123, 104, 238, 0.8)',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
        marginHorizontal: 20,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    formInputContainer:  {
        marginBottom: 70,
        ...StyleSheet.absoluteFill,
        zIndex: -1,
        justifyContent: 'center'
    },
    closeButtonContainer: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 20,
        top: -20
    }
})