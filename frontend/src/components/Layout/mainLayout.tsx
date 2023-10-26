import { useContext } from 'react';

import { Grid } from '@mui/material';

import { AuthContext } from '../AuthContext';
import CardItem from './cardItem';
import Chat from '../Chat/Chat';
import { CodeEditorWithSyntax } from '../CodeEditorWithSyntax/CodeEditorWithSyntax';
import LeftColumn from './leftColumn';

export default function MainLayout() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Grid container spacing={2} height="100%" style={{ marginTop: 0 }}>
      <Grid item xs={12} md={3} height="100%">
        <CardItem>
          <LeftColumn />
        </CardItem>
      </Grid>
      <Grid item xs={12} md={isLoggedIn ? 6 : 9} height="100%">
        <CardItem>
          <CodeEditorWithSyntax />
        </CardItem>
      </Grid>
      {isLoggedIn && (
        <Grid item xs={12} md={3} height="100%">
          <CardItem>
            <Chat />
          </CardItem>
        </Grid>
      )}
    </Grid>
  );
}
