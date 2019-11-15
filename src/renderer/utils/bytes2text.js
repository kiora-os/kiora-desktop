// FROM GitHub Gist enepomnyaschih/base64.js
import bytesToBase64 from './bytes2base64'

const utf8encoder = new TextEncoder();

// All solutions at MDN only provide a way to encode a native JS string to UTF-16 base64 string.
// Here, you can apply any encoding supported by TextEncoder.
export default function(str) {
	return bytesToBase64(utf8encoder.encode(str));
}
