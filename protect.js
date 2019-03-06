
var g = {};

g.r0      = 7;
g.rate    = 0;
g.l       = 70;

g.show    = 500;
g.hide    = 200;
g.k       = 0.125;
g.t       = 1000;
g.i0      = 1;
g.zoom    = 2;
g.a       = 0;

function update () {

  var b           = g.r0 * g.k;

  var immune      = Math.round((g.t - g.i0) * (g.rate / 100.0));

  var susceptible = g.t - g.i0 - immune;

  var infect      = Math.round(sir(g.t, g.i0, susceptible, b/g.t, g.k));
  if (infect < 0)
    infect = 0;

  immuneP         = Math.round(100.0 * immune / g.t);

  infectP         = Math.round(100.0 * infect / g.t);

  protectP        = 100 - infectP - immuneP;
  if (protectP < 0)
    protectP = 0;

  $('#timmune').css('height',(100-immuneP)*g.zoom+'px');
  $('#bimmune').css('height',immuneP*g.zoom+'px');
  $('#nimmune').html(immuneP + '%');

  $('#tinfect').css('height',(100-infectP)*g.zoom+'px');
  $('#binfect').css('height',infectP*g.zoom+'px');
  $('#ninfect').html(infectP + '%');

  $('#tprotect').css('height',(100-protectP)*g.zoom+'px');
  $('#bprotect').css('height',protectP*g.zoom+'px');
  $('#nprotect').html(protectP + '%');

  if (infectP == 0)
    $('#hi').show(g.show);
  else
    $('#hi').hide(g.hide);

  $('#anno1').html('R0=' + g.r0);

  //g.a = Math.round(g.l / (g.r0 * (1.0 - immuneP / 100.0)));
  //if (infectP > 0) {
  //  $('#anno2').show(700);
  //  $('#anno2').html('A=' + g.a);
  // }
  // else {
  //   $('#anno2').hide(700);
  //}
}

function sir(t,i0,s0,b,k) {
  var r0 = t-s0-i0;
  var s1 = s0;
  var i1 = i0;
  var r1 = r0;
  var cnt = 0;
  var itot = i0;
  var safe = 0;
  while(1) {
    safe++;
    if (safe > 2000) {
      //$('#debug').html('err');
      break;
    }
    var inew = s1*i1*b;
    itot += inew;
    var rnew = k*i1;
    var s2 = s1 - inew;
    var i2 = i1 + inew - rnew;
    var r2 = r1 + rnew;
    if (inew < 0.1) {
      cnt++;
      if (cnt > 10)
        break;
    }
    else {
      cnt = 0;
    }
    s1=s2;
    i1=i2;
    r1=r2;
  }
  //console.log(safe);
  return itot;
}

$(function() {

  $('.diseasesel').click(function() {
    g.disease = $(this).text();
    $('#disease').html(g.disease);
    update();
  });

  $('#vslider').slider({
    min: 0,
    max: 100,
    value: g.rate,
    tooltip: 'hide',
    formater: function (v) {
      return(v + "% vax");
    }
  });

  $('#vslider').slider().on('slide', function(ev){
    g.rate = ev.value;
    update();
  });
  $('#vslider').slider().on('slideStop', function(ev){
    g.rate = ev.value;
    update();
  });

  $('#dslider').slider({
    min: 2,
    max: 20,
    value: g.r0,
    tooltip: 'hide',
    formater: function (v) {
      return('R0=' + v);
    }
  });

  $('#dslider').slider().on('slide', function(ev){
    g.r0 = ev.value;
    update();
  });
  $('#dslider').slider().on('slideStop', function(ev){
    g.r0 = ev.value;
    update();
  });

  function x(tit,id) {
     return '<button type="button" id="close" class="close pull-right" onclick="$(&quot;' + id + '&quot;).popover(&quot;hide&quot;);">&times;</button>' + '<div style="cursor: pointer;" onclick="$(&quot;' + id + '&quot;).popover(&quot;hide&quot;);" class="text-info"><strong>' + tit + '</strong></div>';
  }

  $('#about').popover({
   placement: 'bottom',
   trigger: 'click',
   html: true,
   title: x('About this demo','#about'),
   content: 'This demonstration shows what happens when a partially vaccinated but otherwise susceptible population, \
is introduced to a single infection. \
<br><br>Notice that the indirectly protected percentage increases dramatically as the vaccinated percentage nears the herd immunity threshold. \
<br><br>Drag the blue slider right until a smiley face appears to find the herd immunity threshold.\
<br><br><b>Click on text (and any images that appear) for explanations</b>.\
<br><br><a href=\"http://op12no2.me/posts/1476\" target=\"_blank\">more info...</a>.'
  });

  $('#hi').popover({
   placement: 'bottom',
   trigger: 'click',
   html: true,
   title: x('Herd immunity','#hi'),
   content: 'The vaccination rate is at or above the point at which the disease cannot get a hold \
and only a few people (maybe none at all) are additionally infected - the herd immunity threshold.\
<br><br>Seroconversion rates for all vaccines are less than 100% however, \
so vaccine strategies try and operate at over and above the herd immunity threshold.'
  });

  $('#aimmune').popover({
   placement: 'bottom',
   trigger: 'click',
   html: true,
   title: x('Vaccination rate','#aimmune'),
   content: 'Blue slider.\
<br><br>The percentage of the population who have been vaccinated.\
<br><br>For the purposes if this demonstration a long lasting vaccine with 100% seroconversion is assumed.'
  });

  $('#ainfect').popover({
   placement: 'bottom',
   trigger: 'click',
   html: true,
   title: x('Infections','#ainfect'),
   content: 'The percentage of the population who have become infected from the single infection.\
<br><br>As R0 decreases or the vaccination rate increases, \
the overall force of infection is reduced and fewer people are infected.'
  });

  $('#aprotect').popover({
   placement: 'bottom',
   trigger: 'click',
   html: true,
   title: x('Indirect protection','#aprotect'),
   content: 'The percentage of the unvaccinated population who have escaped infection because they are \
indirectly protected by those who are vaccinated, or R0 is very low.\
<br><br>Those that cannot be vaccinated for age or health reasons rely on this indirect protection.\
<br><br>The effect is compromised when people don\'t vaccinate simply out of choice; freeloading. \
<br><br>Drag the blue slider left to mimick the effect of freeloaders.'
  });

 $('#anno1').popover({
   placement: 'bottom',
   trigger: 'click',
   html: true,
   title: x('Basic Reproduction Number','#anno1'),
   content: 'Green slider.\
<br><br>A measure of the infectiousness of a disease.  \
Higher numbers mean more infectious.  \
Typical values are:-\
<br><br>Measles: 12-18\
<br>Pertussis: 12-17\
<br>Polio: 5-7\
<br>Rubella: 5-7\
<br>Mumps: 4-7\
<br>Chickenpox: 8-10\
<br>Smallpox: 5-7\
<br>Zombie infection: 20+'
  });

 $('#anno2').popover({
   placement: 'bottom',
   trigger: 'click',
   html: true,
   title: x('Average age of infection','#anno2'),
   content: 'While mediocre vaccination rates can reduce infection and even provide some \
level of indirect protection, \
the average age of infection increases.\
<br><br>This is highly undesireable for those diseases where morbidity tends to increase with age, \
like chickenpox, \
for which good vaccination coverage and high seroconversion rate are essential.\
<br><br>A lifespan of ' + g.l + ' years is assumed for the average age calculation.'
  });

  $('#about').popover('show');
  update();

});


