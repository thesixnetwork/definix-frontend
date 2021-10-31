import { CaverProvider } from 'finix-caver-providers'

export default function getLibrary(provider: any): CaverProvider {
  const library = new CaverProvider(provider)
  console.log('~~~library', library)
  library.pollingInterval = 15000
  return library
}
