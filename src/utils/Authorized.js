import RenderAuthorized from '../components/Authorized';
import { getLocalAuthority } from './authorityStorage';

const Authorized = RenderAuthorized(getLocalAuthority());
/**
 * 可以通过权限验证
 */
export default Authorized;
