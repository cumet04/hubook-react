import React from 'react';
import {Link} from 'react-router-dom';
import {mdiCog} from '@mdi/js';
import Icon from '@mdi/react';

export default function TheHeader() {
  return (
    <header className="flex items-center h-12 px-6 border-bottom-1 border-gray-400">
      <Link to="/" className="text-lg">
        hubook
      </Link>
      <div className="flex-grow"></div>
      <Link
        to="/preferences"
        className={`grid place-items-center w-8 h-8 ${sPreferenceHover}`}
      >
        <Icon path={mdiCog} color="dimgray" className="w-6 h-6 inset-auto" />
      </Link>
    </header>
  );
}

const sPreferenceHover =
  'rounded-full transition-colors duration-200 bg-white hover:bg-gray-400';
