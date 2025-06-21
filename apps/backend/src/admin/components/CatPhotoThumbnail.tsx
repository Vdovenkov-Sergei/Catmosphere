import React from 'react';
import { BasePropertyProps } from 'adminjs';

const CatPhotoThumbnail: React.FC<BasePropertyProps> = (props) => {
  const { record, property } = props;
  const photoUrl = record?.params?.[property.name];

  if (!photoUrl) return null;
  return (
    <div style={{ margin: '8px 0' }}>
      <a href={photoUrl} target="_blank" rel="noopener noreferrer">
        <img
          src={photoUrl}
          alt="Фото кота"
          style={{
            maxWidth: '150px',
            maxHeight: '150px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        />
      </a>
    </div>
  );
};

export default CatPhotoThumbnail;