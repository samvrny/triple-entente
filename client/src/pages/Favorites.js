import React, { useEffect, useState } from 'react';
import Auth from '../utils/auth';
import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_IMAGE, REMOVE_FONT, REMOVE_PALETTE } from '../utils/mutations';
import WebFont from 'webfontloader';

const Favorites = () => {

    const { loading, data } = useQuery(GET_ME);
    const userData = data?.me || [];
    //const [currentFont, setCurrentFont] = useState('');
    const [removePalette] = useMutation(REMOVE_PALETTE);
    const [removeFont] = useMutation(REMOVE_FONT);
    const [removeImage] = useMutation(REMOVE_IMAGE);

    const loadWebFont = async (font) => {
        WebFont.load({
            google: {
                families: [font.chosenFont]
            }
        });
    }

    useEffect(() => {
        if(!Auth) {
            // logic to redirect
        }
    }, [Auth])

    if (loading) {
        return <h2>LOADING...</h2>
    }

    const handleRemovePalette = async (id) => {
        console.log(id)
        console.log('Click')
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            await removePalette({
                variables: { id }
            })
        } catch(err) {
            console.error(err);
        }
    };

    const handleRemoveFont = async (chosenFont) => {
        console.log(chosenFont)
        console.log('Click')
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            await removeFont({
                variables: { chosenFont }
            })
        } catch(err) {
            console.error(err);
        }
    }

    const handleRemoveImage = async (imageId) => {
        console.log(imageId)
        console.log('Click')
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            await removeImage({
                variables: { imageId }
            })
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <main>
            <h1 className="favorites">Favorites</h1>
            <div>
                <h2>My Color Palettes</h2>
                {!userData.savedPalettes.length && (
                    <p>Please save some color palettes</p>
                )}
                {userData.savedPalettes.map((palette) => {

                    return (
                        <section key={palette._id}>
                            <div style={{ backgroundColor: palette.color1 }}>{palette.color1}</div>
                            <div style={{ backgroundColor: palette.color2 }}>{palette.color2}</div>
                            <div style={{ backgroundColor: palette.color3 }}>{palette.color3}</div>
                            <button onClick={() => handleRemovePalette(palette.id)}>Remove Palette</button>
                        </section>
                    )
                })}
            </div>
            <div>
                <h2>My Fonts</h2>
                {!userData.savedFonts.length && (
                    <p>Please save some fonts</p>
                )}
                {userData.savedFonts.map((font) => {
                    loadWebFont(font);
                    return (
                        <section key={font._id}>
                            <div style={{ fontFamily: font.chosenFont }}>{font.chosenFont}</div>
                            <button onClick={() => handleRemoveFont(font.chosenFont)}>Remove Font</button>
                        </section>
                    )
                })}
            </div>
            <div>
                <h2>My Images</h2>
                {!userData.savedImages.length && (
                    <p>Please save some images</p>
                )}
                {userData.savedImages.map((image) => {
                    return (
                        <section key={image._id}>
                            <h3>By {image.photographer}</h3>
                            <img src={image.small} alt={image.alt}></img>
                            <button onClick={() => handleRemoveImage(image.imageId)}>Remove Image</button>
                        </section>
                    )
                })}
            </div>
        </main>
    );
};

export default Favorites;