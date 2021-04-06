import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

  body {
    background-color: #EBEBEB;
    font-family: 'Montserrat',sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #404041;
    font-weight: 500;

    &:before {
      content: "";
      background-image: url('/images/abstract.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 140%;
      height: 100vh;
      position: fixed; top: 0; left: 0; width: 100vw;
    }

    ${({ theme }) => theme.mediaQueries.md} {
      padding: 24px 64px !important;
    }

    img {
      height: auto;
      max-width: 100%;
    }
  }

  .btn-secondary-disable:disabled {
    background: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.backgroundDisabled};
    color: ${({ theme }) => theme.colors.backgroundDisabled};

    svg { fill: ${({ theme }) => theme.colors.backgroundDisabled}; }
  }

  .text-bold { font-weight: 600; color: ${({ theme }) => theme.colors.text}; }
  .text-right { text-align: right; }
  .text-left { text-align: left; }
  .color-primary { color: ${({ theme }) => theme.colors.primary} !important; }
  .color-text { color: ${({ theme }) => theme.colors.text} !important; }
  .color-disable { color: ${({ theme }) => theme.colors.textDisabled} !important; }

  .flex {
    display: flex !important;
  
    &.flex-column { flex-direction: column; }
    &.flex-column-reverse { flex-direction: column-reverse; }
    &.flex-row { flex-direction: row; }
    &.flex-row-reverse { flex-direction: row-reverse; }
    &.flex-wrap { flex-wrap: wrap; }
    &.justify-start { justify-content: flex-start; }
    &.justify-end { justify-content: flex-end; }
    &.justify-center { justify-content: center; }
    &.justify-space-around { justify-content: space-around; }
    &.justify-space-between { justify-content: space-between; }
    &.align-start { align-items: flex-start; }
    &.align-end { align-items: flex-end; }
    &.align-center { align-items: center; }
    &.align-baseline { align-items: baseline; }
    &.align-stretch { align-items: stretch; }
  
    .flex-grow { flex-grow: 1; }
    .flex-shrink { flex-shrink: 0; }
    .col-12 { width: 100%; }
    .col-9 { width: 75%; }
    .col-6 { width: 50%; }
    .col-4 { width: 33.333%; }
    .col-3 { width: 25%; }
  }

  .ma-0 {
    margin: 0 !important;
  }
  
  .ma-1 {
    margin: 0.25rem !important;
  }
  
  .ma-2 {
    margin: 0.5rem !important;
  }
  
  .ma-3 {
    margin: 1rem !important;
  }
  
  .ma-4 {
    margin: 1.25rem !important;
  }
  
  .ma-5 {
    margin: 1.5rem !important;
  }
  
  .ma-6 {
    margin: 2rem !important;
  }
  
  .ma-7 {
    margin: 3rem !important;
  }
  
  .ma-8 {
    margin: 4rem !important;
  }
  
  .ma-9 {
    margin: 6rem !important;
  }
  
  .mt-0 {
    margin-top: 0 !important;
  }
  
  .mt-1 {
    margin-top: 0.25rem !important;
  }
  
  .mt-2 {
    margin-top: 0.5rem !important;
  }
  
  .mt-3 {
    margin-top: 1rem !important;
  }
  
  .mt-4 {
    margin-top: 1.25rem !important;
  }
  
  .mt-5 {
    margin-top: 1.5rem !important;
  }
  
  .mt-6 {
    margin-top: 2rem !important;
  }
  
  .mt-7 {
    margin-top: 3rem !important;
  }
  
  .mt-8 {
    margin-top: 4rem !important;
  }
  
  .mt-9 {
    margin-top: 6rem !important;
  }
  
  .mb-0 {
    margin-bottom: 0 !important;
  }
  
  .mb-1 {
    margin-bottom: 0.25rem !important;
  }
  
  .mb-2 {
    margin-bottom: 0.5rem !important;
  }
  
  .mb-3 {
    margin-bottom: 1rem !important;
  }
  
  .mb-4 {
    margin-bottom: 1.25rem !important;
  }
  
  .mb-5 {
    margin-bottom: 1.5rem !important;
  }
  
  .mb-6 {
    margin-bottom: 2rem !important;
  }
  
  .mb-7 {
    margin-bottom: 3rem !important;
  }
  
  .mb-8 {
    margin-bottom: 4rem !important;
  }
  
  .mb-9 {
    margin-bottom: 6rem !important;
  }
  
  .ml-0 {
    margin-left: 0 !important;
  }
  
  .ml-1 {
    margin-left: 0.25rem !important;
  }
  
  .ml-2 {
    margin-left: 0.5rem !important;
  }
  
  .ml-3 {
    margin-left: 1rem !important;
  }
  
  .ml-4 {
    margin-left: 1.25rem !important;
  }
  
  .ml-5 {
    margin-left: 1.5rem !important;
  }
  
  .ml-6 {
    margin-left: 2rem !important;
  }
  
  .ml-7 {
    margin-left: 3rem !important;
  }
  
  .ml-8 {
    margin-left: 4rem !important;
  }
  
  .ml-9 {
    margin-left: 6rem !important;
  }
  
  .mr-0 {
    margin-right: 0 !important;
  }
  
  .mr-1 {
    margin-right: 0.25rem !important;
  }
  
  .mr-2 {
    margin-right: 0.5rem !important;
  }
  
  .mr-3 {
    margin-right: 1rem !important;
  }
  
  .mr-4 {
    margin-right: 1.25rem !important;
  }
  
  .mr-5 {
    margin-right: 1.5rem !important;
  }
  
  .mr-6 {
    margin-right: 2rem !important;
  }
  
  .mr-7 {
    margin-right: 3rem !important;
  }
  
  .mr-8 {
    margin-right: 4rem !important;
  }
  
  .mr-9 {
    margin-right: 6rem !important;
  }
  
  .mx-0 {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  
  .mx-1 {
    margin-left: 0.25rem !important;
    margin-right: 0.25rem !important;
  }
  
  .mx-2 {
    margin-left: 0.5rem !important;
    margin-right: 0.5rem !important;
  }
  
  .mx-3 {
    margin-left: 1rem !important;
    margin-right: 1rem !important;
  }
  
  .mx-4 {
    margin-left: 1.25rem !important;
    margin-right: 1.25rem !important;
  }
  
  .mx-5 {
    margin-left: 1.5rem !important;
    margin-right: 1.5rem !important;
  }
  
  .mx-6 {
    margin-left: 2rem !important;
    margin-right: 2rem !important;
  }
  
  .mx-7 {
    margin-left: 3rem !important;
    margin-right: 3rem !important;
  }
  
  .mx-8 {
    margin-left: 4rem !important;
    margin-right: 4rem !important;
  }
  
  .mx-9 {
    margin-left: 6rem !important;
    margin-right: 6rem !important;
  }

  .mx-auto {
    margin-left: auto !important;
    margin-right: auto !important;
  }
  
  .my-0 {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
  
  .my-1 {
    margin-top: 0.25rem !important;
    margin-bottom: 0.25rem !important;
  }
  
  .my-2 {
    margin-top: 0.5rem !important;
    margin-bottom: 0.5rem !important;
  }
  
  .my-3 {
    margin-top: 1rem !important;
    margin-bottom: 1rem !important;
  }
  
  .my-4 {
    margin-top: 1.25rem !important;
    margin-bottom: 1.25rem !important;
  }
  
  .my-5 {
    margin-top: 1.5rem !important;
    margin-bottom: 1.5rem !important;
  }
  
  .my-6 {
    margin-top: 2rem !important;
    margin-bottom: 2rem !important;
  }
  
  .my-7 {
    margin-top: 3rem !important;
    margin-bottom: 3rem !important;
  }
  
  .my-8 {
    margin-top: 4rem !important;
    margin-bottom: 4rem !important;
  }
  
  .my-9 {
    margin-top: 6rem !important;
    margin-bottom: 6rem !important;
  }
  
  .pa-0 {
    padding: 0 !important;
  }
  
  .pa-1 {
    padding: 0.25rem !important;
  }
  
  .pa-2 {
    padding: 0.5rem !important;
  }
  
  .pa-3 {
    padding: 1rem !important;
  }
  
  .pa-4 {
    padding: 1.25rem !important;
  }
  
  .pa-5 {
    padding: 1.5rem !important;
  }
  
  .pa-6 {
    padding: 2rem !important;
  }
  
  .pa-7 {
    padding: 3rem !important;
  }
  
  .pa-8 {
    padding: 4rem !important;
  }
  
  .pa-9 {
    padding: 6rem !important;
  }
  
  .pt-0 {
    padding-top: 0 !important;
  }
  
  .pt-1 {
    padding-top: 0.25rem !important;
  }
  
  .pt-2 {
    padding-top: 0.5rem !important;
  }
  
  .pt-3 {
    padding-top: 1rem !important;
  }
  
  .pt-4 {
    padding-top: 1.25rem !important;
  }
  
  .pt-5 {
    padding-top: 1.5rem !important;
  }
  
  .pt-6 {
    padding-top: 2rem !important;
  }
  
  .pt-7 {
    padding-top: 3rem !important;
  }
  
  .pt-8 {
    padding-top: 4rem !important;
  }
  
  .pt-9 {
    padding-top: 6rem !important;
  }
  
  .pb-0 {
    padding-bottom: 0 !important;
  }
  
  .pb-1 {
    padding-bottom: 0.25rem !important;
  }
  
  .pb-2 {
    padding-bottom: 0.5rem !important;
  }
  
  .pb-3 {
    padding-bottom: 1rem !important;
  }
  
  .pb-4 {
    padding-bottom: 1.25rem !important;
  }
  
  .pb-5 {
    padding-bottom: 1.5rem !important;
  }
  
  .pb-6 {
    padding-bottom: 2rem !important;
  }
  
  .pb-7 {
    padding-bottom: 3rem !important;
  }
  
  .pb-8 {
    padding-bottom: 4rem !important;
  }
  
  .pb-9 {
    padding-bottom: 6rem !important;
  }
  
  .pl-0 {
    padding-left: 0 !important;
  }
  
  .pl-1 {
    padding-left: 0.25rem !important;
  }
  
  .pl-2 {
    padding-left: 0.5rem !important;
  }
  
  .pl-3 {
    padding-left: 1rem !important;
  }
  
  .pl-4 {
    padding-left: 1.25rem !important;
  }
  
  .pl-5 {
    padding-left: 1.5rem !important;
  }
  
  .pl-6 {
    padding-left: 2rem !important;
  }
  
  .pl-7 {
    padding-left: 3rem !important;
  }
  
  .pl-8 {
    padding-left: 4rem !important;
  }
  
  .pl-9 {
    padding-left: 6rem !important;
  }
  
  .pr-0 {
    padding-right: 0 !important;
  }
  
  .pr-1 {
    padding-right: 0.25rem !important;
  }
  
  .pr-2 {
    padding-right: 0.5rem !important;
  }
  
  .pr-3 {
    padding-right: 1rem !important;
  }
  
  .pr-4 {
    padding-right: 1.25rem !important;
  }
  
  .pr-5 {
    padding-right: 1.5rem !important;
  }
  
  .pr-6 {
    padding-right: 2rem !important;
  }
  
  .pr-7 {
    padding-right: 3rem !important;
  }
  
  .pr-8 {
    padding-right: 4rem !important;
  }
  
  .pr-9 {
    padding-right: 6rem !important;
  }
  
  .px-0 {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  
  .px-1 {
    padding-left: 0.25rem !important;
    padding-right: 0.25rem !important;
  }
  
  .px-2 {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
  
  .px-3 {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
  
  .px-4 {
    padding-left: 1.25rem !important;
    padding-right: 1.25rem !important;
  }
  
  .px-5 {
    padding-left: 1.5rem !important;
    padding-right: 1.5rem !important;
  }
  
  .px-6 {
    padding-left: 2rem !important;
    padding-right: 2rem !important;
  }
  
  .px-7 {
    padding-left: 3rem !important;
    padding-right: 3rem !important;
  }
  
  .px-8 {
    padding-left: 4rem !important;
    padding-right: 4rem !important;
  }
  
  .px-9 {
    padding-left: 6rem !important;
    padding-right: 6rem !important;
  }
  
  .py-0 {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
  
  .py-1 {
    padding-top: 0.25rem !important;
    padding-bottom: 0.25rem !important;
  }
  
  .py-2 {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
  }
  
  .py-3 {
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
  }
  
  .py-4 {
    padding-top: 1.25rem !important;
    padding-bottom: 1.25rem !important;
  }
  
  .py-5 {
    padding-top: 1.5rem !important;
    padding-bottom: 1.5rem !important;
  }
  
  .py-6 {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
  }
  
  .py-7 {
    padding-top: 3rem !important;
    padding-bottom: 3rem !important;
  }
  
  .py-8 {
    padding-top: 4rem !important;
    padding-bottom: 4rem !important;
  }
  
  .py-9 {
    padding-top: 6rem !important;
    padding-bottom: 6rem !important;
  }
  
  /*# sourceMappingURL=s.css.map */
  
`

export default GlobalStyle
