import { 
    StatusBar,
    StyleSheet,
    Text,
    Platform,
    Dimensions,
    useColorScheme,
    View,
    TouchableOpacity,
    ImageBackground,
    Image
} from 'react-native'
import React, { useState, useEffect } from 'react';
import {Camera} from 'expo-camera';
//import PermissionsService from '../Permissions';

export const {height, width} = Dimensions.get('window');

const Ditection = () => {
    const [result, setResult] = useState('');
    const [label, setLabel] = useState('');
    const [image, setImage] = useState('');
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
        })();
    }, []);
    const takePicture = async () => {
        if(camera){
            const data = await camera.takePictureAsync(null)
            setImage(data.uri);
        }
    }
    if(hasCameraPermission === false){
        return <Text>No camera Access</Text>;
    }

    const getPredication = async params => {
        return new Promise((resolve, reject) => {
          var bodyFormData = new FormData();
          bodyFormData.append('file', params);
          const url = Config.URL;
          return axios
            .post(url, bodyFormData)
            .then(response => {
              resolve(response);
            })
            .catch(error => {
              setLabel('Failed to predicting.');
              reject('err', error);
            });
        });
    };

    const manageCamera = async type => {
        try {
          if (!(await PermissionsService.hasCameraPermission())) {
            return [];
          } else {
            if (type === 'Camera') {
              openCamera();
            } else {
              openLibrary();
            }
          }
        } catch (err) {
          console.log(err);
        }
    };
    
    const openCamera = async () => {
        launchCamera(options, async response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            const uri = response?.assets[0]?.uri;
            const path = Platform.OS !== 'ios' ? uri : 'file://' + uri;
            getResult(path, response);
          }
        });
    };

    const clearOutput = () => {
        setResult('');
        setImage('');
    };
    
    const getResult = async (path, response) => {
        setImage(path);
        setLabel('Predicting...');
        setResult('');
        const params = {
          uri: path,
          name: response.assets[0].fileName,
          type: response.assets[0].type,
        };
        const res = await getPredication(params);
        if (res?.data?.class) {
          setLabel(res.data.class);
          setResult(res.data.confidence);
        } else {
          setLabel('Failed to predict');
        }
    };
    
    const openLibrary = async () => {
        launchImageLibrary(options, async response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const uri = response.assets[0].uri;
                const path = Platform.OS !== 'ios' ? uri : 'file://' + uri;
                getResult(path, response);
            }
        });
    };

  return (
    <View style={styles.outer}>
      <Text style={styles.title}>Ditection Page</Text>
      <ImageBackground 
        blurRadius={10}
        source={ require('../assets/background2.jpeg')}
        style={{height: height, width: width}}
      />

      <TouchableOpacity style={styles.clearStyle}>
        <Image source={ require('../assets/clean.png')} style={styles.clearImage} /> 
      </TouchableOpacity>

      <View style={styles.btn}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => manageCamera('Camera')}
          style={styles.btnStyle}>
          <Image source={require('../assets/camera.png')} style={styles.imageIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => manageCamera('Photo')}
          style={styles.btnStyle}>
          <Image source={require('../assets/gallery.png')} style={styles.imageIcon} />
        </TouchableOpacity>
      </View>
      {/*<View>
        <Camera 
            ref={ref => setCamera(ref)}
            type={type}
            ratio={'1:1'}
        />
      </View>
      <TouchableOpacity
        onPress={() => takePicture()}
      >
        <Text>Take a Picture</Text>
    </TouchableOpacity>*/}

    </View>
  )
}

export default Ditection

const styles = StyleSheet.create({
    title: {
        alignSelf: 'center',
        position: 'absolute',
        top: 10,
        fontSize: 25,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 15
    },
    clearImage: {
        height: 40, 
        width: 40, 
        tintColor: '#FFF'
    },
    mainOuter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: height / 1.6,
        alignSelf: 'center',
    },
    outer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#98DAD9'
    },
    btn: {
        position: 'absolute',
        bottom: 40,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    btnStyle: {
        backgroundColor: '#FFF',
        opacity: 0.8,
        marginHorizontal: 30,
        padding: 20,
        borderRadius: 20,
    },
    imageStyle: {
        marginBottom: 50,
        width: width / 1.5,
        height: width / 1.5,
        borderRadius: 20,
        position: 'absolute',
        borderWidth: 0.3,
        borderColor: '#FFF',
        top: height / 4.5,
    },
    clearStyle: {
        position: 'absolute',
        top: 20,
        right: 15,
        tintColor: '#FFF',
        zIndex: 10,
    },
    space: {marginVertical: 10, marginHorizontal: 10},
    labelText: {color: '#FFF', fontSize: 20,},
    resultText: {fontSize: 32,},
    imageIcon: {height: 40, width: 40, tintColor: '#000'},
    emptyText: {
        position: 'absolute',
        top: height / 1.6,
        alignSelf: 'center',
        color: '#FFF',
        fontSize: 20,
        maxWidth: '70%',
    }
})