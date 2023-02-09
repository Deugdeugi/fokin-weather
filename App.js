import React from 'react';
import { Alert } from "react-native";
import Loading from "./Loading";
import Weather from "./Weather";
import * as Location from "expo-location";
import axios from "axios";
import {API_KEY} from "@env"

export default class extends React.Component {
  // React.Component 뒤에 () 붙이지 말자.

  state = {
    isLoading: true,
  }

  getWeather = async (latitude, longitude) => {
    const {
      data : {
        main: { temp },
        weather,
        name
      }
    } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );

    console.log("info", temp, weather, name);

    this.setState({
      isLoading: false,
      condition: weather[0].main,
      temp,
      location: name
    });
  };

  getLocation = async() => {
    try {
      await Location.requestForegroundPermissionsAsync();

      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync();

      this.getWeather(latitude, longitude);

    } catch (error) {
      Alert.alert("Can't find you.", "So sad");
    }
  }

  componentDidMount() {
    this.getLocation();
  }

  render() {
    const { isLoading, temp, condition, location } = this.state;
    return isLoading ? <Loading /> : <Weather temp={Math.round(temp)} condition={condition} location={location} />;
  };
}
