import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloClient } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { LoginComponent } from './pages/login/login.component';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { SearchPipe } from './shared/pipes/search.pipe';

export function createApollo(httpLink: HttpLink) {
  const auth = setContext(() => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  });
  return {
    link: auth.concat(httpLink.create({ uri: 'http://localhost:5000/graphql' })),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  declarations: [
    App,
    LoginComponent,
    EmployeeListComponent,
    SearchPipe
  ],
  imports: [
    BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule,
    HttpClientModule, BrowserAnimationsModule, ApolloModule,
    MatToolbarModule, MatCardModule, MatInputModule, MatButtonModule,
    MatTableModule, MatIconModule, MatDialogModule, MatSnackBarModule,
    MatSelectModule, MatFormFieldModule
  ],
  providers: [{ provide: APOLLO_OPTIONS, useFactory: createApollo, deps: [HttpLink] }],
  bootstrap: [App]
})
export class AppModule {}