import { Grid } from '@mui/material';

import CardItem from './CardItem';
import Chat from '../Chat/Chat';
import { CodeEditorWithSyntax } from '../CodeEditorWithSyntax/CodeEditorWithSyntax';
import LeftColumn from './LeftColumn';

export default function MainLayout() {
  return (
    <Grid container spacing={2} height="100%" style={{ marginTop: 0 }}>
      <Grid item xs={12} md={3} lg={3} height="100%">
        <CardItem>
          <LeftColumn />
        </CardItem>
      </Grid>
      <Grid item xs={12} md={6} lg={6} height="100%" overflow={'auto'}>
        <CardItem>
          <CodeEditorWithSyntax />
        </CardItem>
      </Grid>
      <Grid item xs={12} md={3} lg={3} height="100%">
        <CardItem>
          <Chat />
        </CardItem>
      </Grid>
    </Grid>
  );
}
