import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MoreIcon from "@material-ui/icons/MoreVert";
import { ethers } from "ethers";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    fontFamily: '"Segoe UI Symbol"',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  inputRoot: {
    color: "inherit",
  },

  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

export default function Header() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [addrButton, setAddrButton] = React.useState(0);
  const [updatedaddr, setUpdatedaddr] = React.useState("");
  const [networkName, setNetworkName] = React.useState("");
  const [tokenhodl, setTokenhodl] = React.useState(0);
  // const [tokenname, setTokenname] = React.useState("");
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = state;

  const handleClick = (newState) => () => {
    setState({ open: true, ...newState });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    connectMetamask();
  });
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const connectMetamask = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      // Prompt user for account connections
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();

      // console.log(addrButton, await (await provider.getNetwork()).name);
      setNetworkName(await (await provider.getNetwork()).name);
      //Get balance of address
      const balance = await provider.getBalance(addr);
      console.log(
        "Account:",
        addr,
        " Balance : ",
        ethers.utils.formatEther(balance)
      );

      // You can also use an ENS name for the contract address
      const daiAddress = "0x35cce2f5cd6f9b6398a0f0fb355320538ff7c16a";

      // The ERC-20 Contract ABI, which is a common contract interface
      // for tokens (this is the Human-Readable ABI format)
      const daiAbi = [
        // Some details about the token
        "function name() view returns (string)",
        "function symbol() view returns (string)",

        // Get the account balance
        "function balanceOf(address) view returns (uint)",

        // Send some of your tokens to someone else
        "function transfer(address to, uint amount)",

        // An event triggered whenever anyone transfers to someone else
        "event Transfer(address indexed from, address indexed to, uint amount)",
      ];

      // The Contract object

      console.log("network : " + networkName);
      if (networkName === "rinkeby") {
        const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);

        await daiContract.name();
        // 'Dai Stablecoin'

        // Get the ERC-20 token symbol (for tickers and UIs)
        let tokenSymbol = "";
        if ((await daiContract.symbol()) != null) {
          tokenSymbol = await daiContract.symbol();
        }

        // Get the balance of an address
        const balanceDai = await daiContract.balanceOf(addr);

        console.log(ethers.utils.formatUnits(balanceDai, 18));
        let currentBalance = 0;
        if (ethers.utils.formatUnits(balanceDai, 18) != null) {
          currentBalance = ethers.utils.formatUnits(balanceDai, 18);
        }
        // var tokenName = tokenContract.name()
        // var tokenSymbol = tokenContract.symbol()
        if (addr != null) {
          setAddrButton(1);
          // setNetworkName(await (await provider.getNetwork()).name);
          const updatedaddress = addr.substr(0, 4).concat("...");
          setUpdatedaddr(updatedaddress.concat(addr.substr(38, 4)));
          const currtokens = currentBalance.concat(" $");
          setTokenhodl(currtokens.concat(tokenSymbol));
          // setTokenname("$".concat(tokenSymbol));
        }
      }
    }
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>

      {(() => {
        if (addrButton === 0) {
          return (
            <MenuItem>
              <Chip
                // icon={<FaceIcon />}
                align="center"
                label="Connect"
                color="secondary"
                // variant="outlined"
                onClick={connectMetamask}
              />
            </MenuItem>
          );
        } else {
          return (
            <Menu
              anchorEl={mobileMoreAnchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              id={mobileMenuId}
              keepMounted
              align="center"
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={isMobileMenuOpen}
              onClose={handleMobileMenuClose}
            >
              <MenuItem>
                <Chip
                  // icon={<FaceIcon />}
                  align="center"
                  label={networkName}
                />
              </MenuItem>
              <MenuItem>
                <Chip
                  // icon={<FaceIcon />}
                  align="center"
                  label={tokenhodl}
                  color="primary"
                  variant="outlined"
                />
              </MenuItem>
              <MenuItem>
                <Chip
                  // icon={<FaceIcon />}
                  align="center"
                  label={updatedaddr}
                  color="secondary"
                  variant="outlined"
                />
              </MenuItem>
            </Menu>
          );
        }
      })()}
      {/* </MenuItem> */}
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <Paper class="headerColor" elevation={3}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            {/* W$U CRYPTO */}
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {/* <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <IconButton aria-label="show 17 new notifications" color="inherit">
          <Badge badgeContent={17} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <AccountCircle />
        </IconButton> */}
            {(() => {
              if (!(networkName === "rinkeby")) {
                return (
                  <div>
                    <MenuItem>
                      <Chip
                        // icon={<FaceIcon />}
                        align="center"
                        label="Wrong Network"
                        color="primary"
                        variant="outlined"
                      />
                      &nbsp;
                      <Chip
                        // icon={<FaceIcon />}
                        align="center"
                        label="Connect"
                        color="secondary"
                        // variant="outlined"
                        // onClick={connectMetamask}
                        onClick={
                          (connectMetamask,
                          handleClick({
                            vertical: "top",
                            horizontal: "center",
                          }))
                        }
                      />
                    </MenuItem>
                    {/* <Snackbar
                      anchorOrigin={{ vertical, horizontal }}
                      open={open}
                      onClose={handleClose}
                      message="Please connect to Rinkeby Network"
                      key={vertical + horizontal}
                    /> */}
                    <Snackbar
                      anchorOrigin={{ vertical, horizontal }}
                      open={open}
                      autoHideDuration={6000}
                      onClose={handleClose}
                    >
                      <Alert onClose={handleClose} severity="warning">
                        Please connect to rinkeby network!
                      </Alert>
                    </Snackbar>
                    {/* <Alert severity="info">
                      This is an information message!
                    </Alert> */}
                  </div>
                );
              }
              if (addrButton === 0) {
                return (
                  <Chip
                    // icon={<FaceIcon />}
                    align="center"
                    label="Connect"
                    color="secondary"
                    // variant="outlined"
                    onClick={connectMetamask}
                  />
                );
              } else {
                return (
                  <div>
                    <Chip
                      // icon={<FaceIcon />}
                      align="center"
                      label={networkName}
                    />{" "}
                    &nbsp;
                    <Chip
                      // icon={<FaceIcon />}
                      align="center"
                      label={tokenhodl}
                      color="secondary"
                      variant="outlined"
                    />
                    &nbsp;&nbsp;
                    <Chip
                      // icon={<FaceIcon />}
                      align="center"
                      label={updatedaddr}
                      color="primary"
                      // variant="outlined"
                    />
                  </div>
                );
              }
            })()}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
          {renderMobileMenu}
          {renderMenu}
          {/* <button className="login-button" onClick={connectMetamask}>
        Metamask
      </button> */}
        </Toolbar>
      </Paper>
    </div>
  );
}
