import { WEBSITE_NAME } from '@/util/config';
import Subtitle from '../text/Subtitle';

export default function Logo() {
  return <Subtitle style={{ fontWeight: 700 }}>{WEBSITE_NAME}</Subtitle>;
}
