import { get } from 'axios';

const ROOT_URL = 'https://live2.takomaradio.org/spinitron/audioapi.php';

export function getAllShows() {
  return get(ROOT_URL, { params: { request: 'showsbyday' } });
}