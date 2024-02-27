import axios from "axios";
import React, { useState, useEffect } from "react";
import {StyleSheet, Text, ScrollView, View, Image, Platform, TouchableHighlight,} from "react-native";
import { REACT_APP_RAWG_API_KEY } from '@env';

import Constants from "expo-constants";

const baseUrl = "https://api.rawg.io";

function Game({ gameObject }) {
    return (
        <View>
            <Image
                source={{ uri: gameObject.background_image }}
                style={{ width: 200, height: 200, borderRadius: 20 }}
            />
            <Text style={{ textAlign: "center", fontSize: 20 }}>
                {gameObject.name}
            </Text>
        </View>
    );
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export default function App() {
    const [gameId, setGameId] = useState(1);
    const [game, setGame] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setErrorFlag] = useState(false);

    const changeGameIdHandler = () => {
        setGameId((gameId) => (getRandomInt(100000)));
    };

    useEffect(() => {
        const abortController = new AbortController();
        const url = `${baseUrl}/api/games/${gameId}?key=${REACT_APP_RAWG_API_KEY}`;

        const fetchGame = async () => {
            try {
                setIsLoading(true);

                const response = await axios.get(url, {
                    signal: abortController.signal,
                    method: 'get',
                });

                if (response.status === 200) {
                    setGame(response.data);
                    setIsLoading(false);

                    return;
                } else {
                    throw new Error("Failed to fetch game");
                }
            } catch (error) {
                if (abortController.signal.aborted) {
                    console.log("Data fetching cancelled");
                } else {
                    setErrorFlag(true);
                    setIsLoading(false);
                }
            }
        };

        fetchGame();

        return () => abortController.abort("Data fetching cancelled");
    }, [gameId]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.wrapperStyle}>
                {!isLoading && !hasError && game && <Game gameObject={game} />}
            </View>
            <View style={styles.wrapperStyle}>
                {isLoading && <Text> Loading </Text>}
                {!isLoading && hasError && <Text> An error has occurred </Text>}
            </View>
            <View>
                <TouchableHighlight
                    onPress={changeGameIdHandler}
                    disabled={isLoading}
                    style={styles.buttonStyles}
                >
                    <Text style={styles.textStyles}>Get New Game</Text>
                </TouchableHighlight>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        marginTop: Platform.OS === "ios" ? 0 : Constants.statusBarHeight,
    },
    wrapperStyle: {
        minHeight: 128,
    },
    buttonStyles: {
        backgroundColor: "dodgerblue",
    },
    textStyles: {
        fontSize: 20,
        color: "white",
        padding: 10,
    },
});