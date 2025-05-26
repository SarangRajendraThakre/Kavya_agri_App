// utils/theme.ts or constants/styles.ts

export enum Colors {
  primary = '#e695a4',
  background = '#000',
  text = '#FFFFFF',
  backgroundDark = '#121212',
  backgroundLight = '#1F1F1F',
  inactive = '#B3B3B3',
}

export enum Fonts {
  // Satoshi Fonts (already present and confirmed from screenshot)
  SatoshiRegular = 'Satoshi-Regular',
  SatoshiMedium = 'Satoshi-Medium',
  SatoshiLight = 'Satoshi-Light',
  SatoshiBlack = 'Satoshi-Black',
  SatoshiBold = 'Satoshi-Bold',

  // Abril Fatface
  AbrilFatfaceRegular = 'AbrilFatface-Regular',

  // Akaya Kanadaka
  AkayaKanadakaRegular = 'AkayaKanadaka-Regular',


  // Poppins Fonts (all variants from screenshot)
  PoppinsBlack = 'Poppins-Black',
  PoppinsBlackItalic = 'Poppins-BlackItalic',
  PoppinsBold = 'Poppins-Bold',
  PoppinsBoldItalic = 'Poppins-BoldItalic',
  PoppinsExtraBold = 'Poppins-ExtraBold',
  PoppinsExtraBoldItalic = 'Poppins-ExtraBoldItalic',
  PoppinsExtraLight = 'Poppins-ExtraLight',
  PoppinsExtraLightItalic = 'Poppins-ExtraLightItalic',
  PoppinsItalic = 'Poppins-Italic',
  PoppinsLight = 'Poppins-Light',
  PoppinsLightItalic = 'Poppins-LightItalic',
  PoppinsMedium = 'Poppins-Medium',
  PoppinsMediumItalic = 'Poppins-MediumItalic',
  PoppinsRegular = 'Poppins-Regular',
  PoppinsSemiBold = 'Poppins-SemiBold',
  PoppinsSemiBoldItalic = 'Poppins-SemiBoldItalic',
  PoppinsThin = 'Poppins-Thin',
  PoppinsThinItalic = 'Poppins-ThinItalic',


}

// Your existing convertPodcast function (no changes needed here)
export const convertPodcast = (podcast: any) => {
  return {
    id: podcast.id,
    url: podcast.audio_uri,
    title: podcast.title,
    artist: podcast.artist.name,
    artwork: podcast.artwork,
  };
};