import React, { useState, useEffect, useCallback, useRef } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Drawer,
  Fab,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tabs,
  Tab,
  TextField, // <-- Import TextField here
  Toolbar,
  Typography,
  useMediaQuery,
  Zoom
} from '@mui/material';
import {
  Search,
  Favorite,
  FavoriteBorder,
  Close,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
  Brightness4,
  Brightness7,
  Share,
  ThumbUp,
  Visibility,
  Comment,
  KeyboardArrowUp, // <-- Import KeyboardArrowUp here
  Star
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const API_KEY = 'AIzaSyAsxnp7YgiJIfZWoaYkRFWIatgcrjBZh18';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const SearchBar = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.common.white,
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const YouTubeMovieExplorer = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [category, setCategory] = useState('Trailer');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [layout, setLayout] = useState('grid');
  const [userRatings, setUserRatings] = useState({});
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const observerTarget = useRef(null);
  const page = useRef('');

  const categories = [
    'Trailer', 'Review', 'Behind the Scenes', 'Interviews', 'Fan Theories',
    'Movie Facts', 'Deleted Scenes', 'Bloopers', 'Movie Analysis', 'Film History',
    'Movie Soundtracks', 'VFX Breakdown', 'Actor Spotlight', 'Director\'s Commentary',
    'Movie Easter Eggs', 'Film Techniques', 'Movie Locations', 'Costume Design', 'Prop Making'
  ];

  const fetchVideos = useCallback(async (reset = false) => {
    if (reset) {
      page.current = '';
      setVideos([]);
    }
    setLoading(true);
    setError(null);
    try {
      const query = searchQuery || `${category} movies`;
      const response = await fetch(
        `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=1&maxResults=12&pageToken=${page.current}&order=${sortBy}&key=${API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch videos');
      const data = await response.json();
      const videoIds = data.items.map(item => item.id.videoId).join(',');
      const detailsResponse = await fetch(
        `${BASE_URL}/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`
      );
      if (!detailsResponse.ok) throw new Error('Failed to fetch video details');
      const detailsData = await detailsResponse.json();
      setVideos(prev => [...prev, ...detailsData.items]);
      page.current = data.nextPageToken;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, searchQuery, sortBy]);

  useEffect(() => {
    fetchVideos(true);
  }, [fetchVideos]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && page.current) {
          fetchVideos();
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [fetchVideos, loading]);

  const fetchRelatedVideos = useCallback(async (videoId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=5&key=${API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch related videos');
      const data = await response.json();
      setRelatedVideos(data.items);
    } catch (err) {
      console.error('Error fetching related videos:', err);
    }
  }, []);

  const fetchComments = useCallback(async (videoId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/commentThreads?part=snippet&videoId=${videoId}&maxResults=10&key=${API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data.items);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      fetchRelatedVideos(selectedVideo.id);
      fetchComments(selectedVideo.id);
    }
  }, [selectedVideo, fetchRelatedVideos, fetchComments]);

  const formatViewCount = (count) => {
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(count);
  };

  const toggleFavorite = (video) => {
    setFavorites(prev =>
      prev.some(v => v.id === video.id)
        ? prev.filter(v => v.id !== video.id)
        : [...prev, video]
    );
  };

  const rateVideo = (videoId, rating) => {
    setUserRatings(prev => ({ ...prev, [videoId]: rating }));
  };

  const addComment = () => {
    if (newComment.trim()) {
      setComments(prev => [{
        snippet: {
          topLevelComment: {
            snippet: {
              textDisplay: newComment,
              authorDisplayName: 'You',
              publishedAt: new Date().toISOString()
            }
          }
        }
      }, ...prev]);
      setNewComment('');
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVideos(true);
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    fetchVideos(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const VideoCard = ({ video }) => {
    const isFavorite = favorites.some(v => v.id === video.id);
    const userRating = userRatings[video.id] || 0;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            '&:hover': {
              boxShadow: 6,
              transform: 'scale(1.03)',
              transition: 'all 0.2s ease-in-out',
            },
          }}
        >
          <CardMedia
            component="img"
            height="140"
            image={video.snippet.thumbnails.medium.url}
            alt={video.snippet.title}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h6" component="div" noWrap>
              {video.snippet.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {video.snippet.description}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip 
                icon={<ThumbUp />} 
                label={formatViewCount(video.statistics.likeCount)} 
                size="small" 
              />
              <Chip 
                icon={<Visibility />} 
                label={formatViewCount(video.statistics.viewCount)} 
                size="small" 
              />
            </Box>
          </CardContent>
          <CardActions>
            <IconButton 
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              onClick={() => toggleFavorite(video)}
            >
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
            <IconButton aria-label="Share">
              <Share />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <Button size="small" onClick={() => setSelectedVideo(video)}>
              View Details
            </Button>
          </CardActions>
        </Card>
      </motion.div>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open} color="default">
        <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <ExpandMore />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            YouTube Movie Explorer
          </Typography>
          <SearchBar>
            <SearchIconWrapper>
              <Search />
            </SearchIconWrapper>
            <form onSubmit={handleSearch}>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </SearchBar>
          <IconButton sx={{ ml: 1 }} onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </DrawerHeader>
        <List>
          {categories.map((text, index) => (
            <ListItem 
              button 
              key={text}
              onClick={() => handleCategoryClick(text)}
              selected={category === text}
            >
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Box sx={{ mb: 4 }}>
  <Button
    variant={showFavorites ? "contained" : "outlined"}
    onClick={() => setShowFavorites(!showFavorites)}
    startIcon={showFavorites ? <Favorite /> : <FavoriteBorder />}
  >
    {showFavorites ? 'Show All' : 'Show Favorites'}
  </Button>
</Box>
        <Grid container spacing={3}>
          <AnimatePresence>
            {videos
              .filter((video) => (showFavorites ? favorites.some((fav) => fav.id === video.id) : true))
              .map((video) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                  <VideoCard video={video} />
                </Grid>
              ))}
          </AnimatePresence>
        </Grid>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
        <div ref={observerTarget} style={{ height: '20px', margin: '20px 0' }} />
        <Dialog
          open={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          maxWidth="md"
          fullWidth
          fullScreen={isSmallScreen}
        >
          {selectedVideo && (
            <>
              <DialogTitle>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  {selectedVideo.snippet.title}
                </Typography>
                <IconButton
                  aria-label="close"
                  onClick={() => setSelectedVideo(null)}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <Close />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                <Box sx={{ mb: 2 }}>
                  <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                    <iframe
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                      }}
                      src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                      title={selectedVideo.snippet.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </Box>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="video details tabs">
                  <Tab label="Details" />
                  <Tab label="Related Videos" />
                  <Tab label="Comments" />
                </Tabs>
                <Box sx={{ mt: 2 }}>
                  {tabValue === 0 && (
                    <Box>
                      <Typography variant="body1" paragraph>
                        {selectedVideo.snippet.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Chip icon={<ThumbUp />} label={formatViewCount(selectedVideo.statistics.likeCount)} />
                        <Chip icon={<Visibility />} label={formatViewCount(selectedVideo.statistics.viewCount)} />
                        <Chip icon={<Comment />} label={formatViewCount(selectedVideo.statistics.commentCount)} />
                      </Box>
                      <Button
                        variant={favorites.some(v => v.id === selectedVideo.id) ? "contained" : "outlined"}
                        startIcon={favorites.some(v => v.id === selectedVideo.id) ? <Favorite /> : <FavoriteBorder />}
                        onClick={() => toggleFavorite(selectedVideo)}
                        sx={{ mr: 1 }}
                      >
                        {favorites.some(v => v.id === selectedVideo.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                      </Button>
                      <Button variant="outlined" startIcon={<Share />}>
                        Share
                      </Button>
                    </Box>
                  )}
                  {tabValue === 1 && (
                    <Grid container spacing={2}>
                      {relatedVideos.map((video) => (
                        <Grid item xs={12} sm={6} key={video.id.videoId}>
                          <Card sx={{ display: 'flex', height: '100%' }}>
                            <CardMedia
                              component="img"
                              sx={{ width: 151 }}
                              image={video.snippet.thumbnails.medium.url}
                              alt={video.snippet.title}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                              <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography component="div" variant="subtitle1" noWrap>
                                  {video.snippet.title}
                                </Typography>
                              </CardContent>
                              <CardActions>
                                <Button size="small" onClick={() => setSelectedVideo({ ...video, id: video.id.videoId })}>
                                  View
                                </Button>
                              </CardActions>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                  {tabValue === 2 && (
                    <Box>
                      <Box component="form" onSubmit={(e) => { e.preventDefault(); addComment(); }} sx={{ mb: 2 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          sx={{ mb: 1 }}
                        />
                        <Button type="submit" variant="contained">
                          Post Comment
                        </Button>
                      </Box>
                      <List>
                        {comments.map((comment, index) => (
                          <ListItem key={index} alignItems="flex-start">
                            <ListItemText
                              primary={comment.snippet.topLevelComment.snippet.authorDisplayName}
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {comment.snippet.topLevelComment.snippet.textDisplay}
                                  </Typography>
                                  {` — ${new Date(comment.snippet.topLevelComment.snippet.publishedAt).toLocaleDateString()}`}
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              </DialogContent>
            </>
          )}
        </Dialog>
      </Main>
      <Zoom
        in={!loading}
        timeout={300}
        style={{
          transitionDelay: `${loading ? '500ms' : '0ms'}`,
        }}
        unmountOnExit
      >
        <Fab 
          color="primary" 
          aria-label="scroll back to top"
          onClick={() => window.scrollTo(0, 0)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default YouTubeMovieExplorer;