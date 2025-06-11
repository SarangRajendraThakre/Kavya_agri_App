// utils/theme.ts or constants/styles.ts

export const API_GRAPHQL_ENDPOINT = 'http://192.168.45.188:3000/graphql';
export const Backend_Main = 'http://192.168.45.188:3000';
export const BACKEND_API_URL = 'https://192.168.45.188:3000/auth/userCreation';
export const PRESIGNED_URL_BACKEND_ENDPOINT = 'http://192.168.45.188:3000/generate-s3-presigned-url';



// export const API_GRAPHQL_ENDPOINT = 'https://api.kavyaagri.in/graphql';
// export const Backend_Main = 'https://api.kavyaagri.in';
// export const BACKEND_API_URL = 'https://api.kavyaagri.in/auth/userCreation';
//  export const PRESIGNED_URL_BACKEND_ENDPOINT = 'https://api.kavyaagri.in/s3/generate-s3-presigned-url';


export enum Colors {
  primary = '#e695a4',
  background = '#000',
  text = '#FFFFFF',
  backgroundDark = '#121212',
  backgroundLight = '#1F1F1F',
  inactive = '#B3B3B3',

  white = '#FFFFFF',
  black = '#323232',
  black60 = '#B6B6B6',
  btnColor = '#FF8D4D',
  offColor = '#DDDDDD',

  lightGrey='#D3D3D3'
}

export enum Fonts {
  // Satoshi Fonts
  SatoshiRegular = 'Satoshi-Regular',
  SatoshiMedium = 'Satoshi-Medium',
  SatoshiLight = 'Satoshi-Light',
  SatoshiBlack = 'Satoshi-Black',
  SatoshiBold = 'Satoshi-Bold',

  // Abril Fatface
  AbrilFatfaceRegular = 'AbrilFatface-Regular',

  // Akaya Kanadaka
  AkayaKanadakaRegular = 'AkayaKanadaka-Regular',

  // Poppins Fonts
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

// Define the interface for the incoming podcast object.
export interface Podcast {
  id: string;
  audio_uri: string;
  title: string;
  artist: {
    name: string;
  };
  artwork: string;
}

// Define the interface for the converted podcast object.
export interface ConvertedPodcast {
  id: string;
  url: string;
  title: string;
  artist: string;
  artwork: string;
}

// The convertPodcast function
export const convertPodcast = (podcast: Podcast): ConvertedPodcast => {
  return {
    id: podcast.id,
    url: podcast.audio_uri,
    title: podcast.title,
    artist: podcast.artist.name,
    artwork: podcast.artwork,
  };
};

// Default export of image assets
export default {
  logoImage: require('./../assets/images/loginpage.png'),
  Editicon: require('./../assets/images/Editicon.png'),
  back_arrow: require('./../assets/images/back_arrow.png'),
  successIc: require('./../assets/images/succ.png'),
} as const;
